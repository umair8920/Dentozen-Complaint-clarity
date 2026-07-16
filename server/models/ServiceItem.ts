import { getPool, query } from "../db/pool";

export type ServiceSection = "pricing" | "build-your-package" | "packages" | "package-comparison";
export type ServiceItemStatus = "active" | "draft";
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export type ServiceItemRecord = {
  id: string;
  section: ServiceSection;
  content_key: string | null;
  title: string;
  description: string;
  price: string | null;
  status: ServiceItemStatus;
  display_order: number;
  metadata: JsonObject;
  created_at: Date;
  updated_at: Date;
};

export type ServiceItemInput = {
  section: ServiceSection;
  contentKey?: string | null;
  title: string;
  description?: string;
  price?: number | null;
  status?: ServiceItemStatus;
  displayOrder?: number;
  metadata?: JsonObject;
};

export type ServiceCategoryRecord = {
  id: string;
  name: string;
  display_order: number;
  pricing_note: string;
  builder_note: string;
  created_at: Date;
  updated_at: Date;
};

export type ServiceCategoryInput = {
  name: string;
  displayOrder?: number;
  pricingNote?: string;
  builderNote?: string;
};

function toPublicItem(item: ServiceItemRecord) {
  return {
    id: item.id,
    contentKey: item.content_key,
    section: item.section,
    title: item.title,
    description: item.description,
    price: item.price == null ? null : Number(item.price),
    status: item.status,
    displayOrder: item.display_order,
    metadataJson: JSON.stringify(item.metadata ?? {}, null, 2),
    metadata: item.metadata ?? {},
  };
}

function toPublicCategory(category: ServiceCategoryRecord) {
  return {
    id: category.id,
    name: category.name,
    displayOrder: category.display_order,
    pricingNote: category.pricing_note,
    builderNote: category.builder_note,
  };
}

function normalizeCategoryName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Category name is required.");
  }
  return trimmed;
}

export const ServiceItemModel = {
  toPublicItem,

  async list(section?: ServiceSection) {
    const result = await query<ServiceItemRecord>(
      `select * from admin_service_items
       ${section ? "where section = $1" : ""}
       order by section asc, display_order asc, created_at desc`,
      section ? [section] : [],
    );
    return result.rows;
  },

  async listActive(section: ServiceSection) {
    const result = await query<ServiceItemRecord>(
      `select * from admin_service_items
       where section = $1 and status = 'active'
       order by display_order asc, created_at desc`,
      [section],
    );
    return result.rows;
  },

  async stats() {
    const result = await query<{ section: ServiceSection; total: string }>(
      `select section, count(*)::text as total
       from admin_service_items
       group by section`,
    );
    return result.rows.reduce((acc, row) => ({ ...acc, [row.section]: Number(row.total) }), {
      pricing: 0,
      "build-your-package": 0,
      packages: 0,
      "package-comparison": 0,
    } as Record<ServiceSection, number>);
  },

  async create(input: ServiceItemInput) {
    const result = await query<ServiceItemRecord>(
      `insert into admin_service_items
        (section, content_key, title, description, price, status, display_order, metadata)
       values ($1, $2, $3, $4, $5, $6, $7, $8)
       returning *`,
      [
        input.section,
        input.contentKey ?? null,
        input.title,
        input.description ?? "",
        input.price ?? null,
        input.status ?? "active",
        input.displayOrder ?? 0,
        input.metadata ?? {},
      ],
    );
    return result.rows[0];
  },

  async update(id: string, input: Omit<ServiceItemInput, "section">) {
    const result = await query<ServiceItemRecord>(
      `update admin_service_items
       set title = $2,
           description = $3,
           price = $4,
           status = $5,
           display_order = $6,
           metadata = $7,
           updated_at = now()
       where id = $1
       returning *`,
      [
        id,
        input.title,
        input.description ?? "",
        input.price ?? null,
        input.status ?? "active",
        input.displayOrder ?? 0,
        input.metadata ?? {},
      ],
    );
    return result.rows[0] ?? null;
  },

  async delete(id: string) {
    const result = await query<{ id: string }>(
      `with target as (
         select
           id,
           section,
           coalesce(metadata->>'itemId', content_key, id::text) as item_id
         from admin_service_items
         where id = $1
       ),
       deleted as (
         delete from admin_service_items item
         using target
         where item.id = target.id
           or (
             target.section in ('pricing', 'build-your-package')
             and item.section in ('pricing', 'build-your-package')
             and coalesce(item.metadata->>'itemId', item.content_key, item.id::text) = target.item_id
           )
         returning item.id
       )
       select id from deleted`,
      [id],
    );
    return result.rows[0] ?? null;
  },
};

export const ServiceCategoryModel = {
  toPublicCategory,

  async list() {
    const result = await query<ServiceCategoryRecord>(
      `select *
       from admin_service_categories
       order by display_order asc, name asc`,
    );
    return result.rows;
  },

  async create(input: ServiceCategoryInput) {
    const name = normalizeCategoryName(input.name);
    const result = await query<ServiceCategoryRecord>(
      `insert into admin_service_categories (name, display_order, pricing_note, builder_note)
       values ($1, $2, $3, $4)
       returning *`,
      [name, input.displayOrder ?? 0, input.pricingNote ?? "", input.builderNote ?? ""],
    );
    return result.rows[0];
  },

  async update(id: string, input: ServiceCategoryInput) {
    const name = normalizeCategoryName(input.name);
    const pool = getPool();
    const client = await pool.connect();

    try {
      await client.query("begin");
      const current = await client.query<ServiceCategoryRecord>(
        `select *
         from admin_service_categories
         where id = $1
         for update`,
        [id],
      );
      const category = current.rows[0];
      if (!category) {
        await client.query("rollback");
        return null;
      }

      const updated = await client.query<ServiceCategoryRecord>(
        `update admin_service_categories
         set name = $2,
             display_order = $3,
             pricing_note = $4,
             builder_note = $5,
             updated_at = now()
         where id = $1
         returning *`,
        [
          id,
          name,
          input.displayOrder ?? category.display_order,
          input.pricingNote ?? category.pricing_note,
          input.builderNote ?? category.builder_note,
        ],
      );

      if (category.name !== name) {
        await client.query(
          `update admin_service_items
           set metadata = jsonb_set(metadata, '{category}', to_jsonb($2::text), true),
               updated_at = now()
           where section in ('pricing', 'build-your-package')
             and metadata->>'category' = $1`,
          [category.name, name],
        );
      }

      await client.query("commit");
      return updated.rows[0];
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  },

  async delete(id: string) {
    const pool = getPool();
    const client = await pool.connect();

    try {
      await client.query("begin");
      const current = await client.query<ServiceCategoryRecord>(
        `select *
         from admin_service_categories
         where id = $1
         for update`,
        [id],
      );
      const category = current.rows[0];
      if (!category) {
        await client.query("rollback");
        return null;
      }

      const usage = await client.query<{ total: string }>(
        `select count(*)::text as total
         from admin_service_items
         where section in ('pricing', 'build-your-package')
           and metadata->>'category' = $1`,
        [category.name],
      );

      if (Number(usage.rows[0]?.total ?? 0) > 0) {
        const fallbackName =
          category.name.toLowerCase() === "uncategorized" ? "General" : "Uncategorized";

        await client.query(
          `insert into admin_service_categories (name, display_order)
           values ($1, 9999)
           on conflict ((lower(name))) do nothing`,
          [fallbackName],
        );

        await client.query(
          `update admin_service_items
           set metadata = jsonb_set(metadata, '{category}', to_jsonb($2::text), true),
               updated_at = now()
           where section in ('pricing', 'build-your-package')
             and metadata->>'category' = $1`,
          [category.name, fallbackName],
        );
      }

      const deleted = await client.query<{ id: string }>(
        `delete from admin_service_categories
         where id = $1
         returning id`,
        [id],
      );
      await client.query("commit");
      return deleted.rows[0] ?? null;
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  },
};
