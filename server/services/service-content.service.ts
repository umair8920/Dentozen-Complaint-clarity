import {
  ServiceItemModel,
  type JsonObject,
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
    const [items, stats] = await Promise.all([
      ServiceItemModel.list(section),
      ServiceItemModel.stats(),
    ]);

    return {
      stats,
      items: items.map(ServiceItemModel.toPublicItem),
    };
  },

  async listPublic(section: ServiceSection) {
    return (await ServiceItemModel.listActive(section)).map(ServiceItemModel.toPublicItem);
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
};
