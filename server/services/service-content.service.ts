import {
  ServiceCategoryModel,
  ServiceItemModel,
  type JsonObject,
  type ServiceCategoryInput,
  type ServiceItemInput,
  type ServiceSection,
} from "../models/ServiceItem";

type ServiceItemApiInput = Omit<ServiceItemInput, "metadata"> & {
  metadataJson?: string;
};

function parseMetadata(metadataJson?: string) {
  if (!metadataJson?.trim()) {
    return {};
  }

  return JSON.parse(metadataJson) as JsonObject;
}

export const ServiceContentService = {
  async list(section?: ServiceSection) {
    const [items, stats, categories] = await Promise.all([
      ServiceItemModel.list(section),
      ServiceItemModel.stats(),
      ServiceCategoryModel.list(),
    ]);

    return {
      stats,
      items: items.map(ServiceItemModel.toPublicItem),
      categories: categories.map(ServiceCategoryModel.toPublicCategory),
    };
  },

  async listPublic(section: ServiceSection) {
    const [items, categories] = await Promise.all([
      ServiceItemModel.listActive(section),
      ServiceCategoryModel.list(),
    ]);

    return {
      items: items.map(ServiceItemModel.toPublicItem),
      categories: categories.map(ServiceCategoryModel.toPublicCategory),
    };
  },

  async create(input: ServiceItemApiInput) {
    return ServiceItemModel.toPublicItem(
      await ServiceItemModel.create({ ...input, metadata: parseMetadata(input.metadataJson) }),
    );
  },

  async update(id: string, input: Omit<ServiceItemApiInput, "section">) {
    const item = await ServiceItemModel.update(id, {
      ...input,
      metadata: parseMetadata(input.metadataJson),
    });
    if (!item) {
      throw new Error("Service item not found.");
    }
    return ServiceItemModel.toPublicItem(item);
  },

  async delete(id: string) {
    const deleted = await ServiceItemModel.delete(id);
    if (!deleted) {
      throw new Error("Service item not found.");
    }
    return deleted;
  },

  async createCategory(input: ServiceCategoryInput) {
    try {
      return ServiceCategoryModel.toPublicCategory(await ServiceCategoryModel.create(input));
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new Error("A category with this name already exists.");
      }
      throw error;
    }
  },

  async updateCategory(id: string, input: ServiceCategoryInput) {
    try {
      const category = await ServiceCategoryModel.update(id, input);
      if (!category) {
        throw new Error("Category not found.");
      }
      return ServiceCategoryModel.toPublicCategory(category);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new Error("A category with this name already exists.");
      }
      throw error;
    }
  },

  async deleteCategory(id: string) {
    const deleted = await ServiceCategoryModel.delete(id);
    if (!deleted) {
      throw new Error("Category not found.");
    }
    return deleted;
  },
};

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}
