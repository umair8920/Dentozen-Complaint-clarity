import { query } from "../db/pool";

export type ServiceSection = "services" | "pricing" | "build-your-package" | "packages";
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
      services: 0,
      pricing: 0,
      "build-your-package": 0,
      packages: 0,
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
      `delete from admin_service_items
       where id = $1
       returning id`,
      [id],
    );
    return result.rows[0] ?? null;
  },
};
