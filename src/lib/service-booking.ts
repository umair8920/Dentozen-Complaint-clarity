import { decodeSelection } from "@/lib/package-selection";

export type BookingScope = "individual" | "team" | "practice" | "resource";
export type FulfilmentType = "onsite" | "remote" | "delivery" | "subscription" | "mixed";

export type ServiceBookingProfile = {
  scope: BookingScope;
  fulfilmentType: FulfilmentType;
  needsPractice: boolean;
  needsSiteAddress: boolean;
  needsPreferredDates: boolean;
  needsTeamDetails: boolean;
  needsEquipmentDetails: boolean;
  needsRadiationDetails: boolean;
  needsDeliveryAddress: boolean;
};

type ProfileInput = {
  serviceKey: string;
  serviceSource?: string;
  packageSelection?: string;
};

const EMPTY_PROFILE: ServiceBookingProfile = {
  scope: "practice",
  fulfilmentType: "onsite",
  needsPractice: true,
  needsSiteAddress: true,
  needsPreferredDates: true,
  needsTeamDetails: false,
  needsEquipmentDetails: false,
  needsRadiationDetails: false,
  needsDeliveryAddress: false,
};

const TRAINING_KEYS = new Set([
  "training-session",
  "tr-bls",
  "tr-ils",
  "tr-complaints",
  "tr-ci-house",
  "tr-ci-online",
  "tr-safeguarding",
]);

const REMOTE_TRAINING_KEYS = new Set(["tr-ci-online"]);
const RPA_KEYS = new Set(["rpa-month", "rpa-year"]);

function profileForSingleKey(serviceKey: string, serviceSource?: string): ServiceBookingProfile {
  if (serviceSource === "resources" || serviceKey.startsWith("log-")) {
    return {
      scope: "resource",
      fulfilmentType: "delivery",
      needsPractice: false,
      needsSiteAddress: false,
      needsPreferredDates: false,
      needsTeamDetails: false,
      needsEquipmentDetails: false,
      needsRadiationDetails: false,
      needsDeliveryAddress: true,
    };
  }

  if (TRAINING_KEYS.has(serviceKey) || serviceKey.startsWith("tr-")) {
    const remote = REMOTE_TRAINING_KEYS.has(serviceKey);
    return {
      scope: "team",
      fulfilmentType: remote ? "remote" : "onsite",
      needsPractice: true,
      needsSiteAddress: !remote,
      needsPreferredDates: true,
      needsTeamDetails: true,
      needsEquipmentDetails: false,
      needsRadiationDetails: false,
      needsDeliveryAddress: false,
    };
  }

  if (RPA_KEYS.has(serviceKey)) {
    return {
      scope: "practice",
      fulfilmentType: "subscription",
      needsPractice: true,
      needsSiteAddress: true,
      needsPreferredDates: false,
      needsTeamDetails: false,
      needsEquipmentDetails: false,
      needsRadiationDetails: true,
      needsDeliveryAddress: false,
    };
  }

  if (serviceKey.startsWith("d365-")) {
    return {
      ...EMPTY_PROFILE,
      needsEquipmentDetails: true,
    };
  }

  if (serviceKey === "pkg-essential") {
    return {
      ...EMPTY_PROFILE,
      fulfilmentType: "mixed",
      needsEquipmentDetails: true,
    };
  }

  if (serviceKey === "pkg-safety") {
    return {
      ...EMPTY_PROFILE,
      scope: "team",
      fulfilmentType: "mixed",
      needsTeamDetails: true,
      needsEquipmentDetails: true,
    };
  }

  if (serviceKey === "pkg-complete" || serviceKey === "managed-service") {
    return {
      ...EMPTY_PROFILE,
      fulfilmentType: "mixed",
      needsEquipmentDetails: true,
      needsRadiationDetails: true,
    };
  }

  if (serviceKey === "consultation" || serviceKey === "cqc-appeal") {
    return {
      ...EMPTY_PROFILE,
      fulfilmentType: "remote",
      needsSiteAddress: false,
      needsEquipmentDetails: false,
    };
  }

  return EMPTY_PROFILE;
}

function combineProfiles(profiles: ServiceBookingProfile[]): ServiceBookingProfile {
  if (profiles.length === 0) {
    return EMPTY_PROFILE;
  }

  const scopes = new Set(profiles.map((profile) => profile.scope));
  const fulfilmentTypes = new Set(profiles.map((profile) => profile.fulfilmentType));

  return {
    scope: scopes.size === 1 ? profiles[0].scope : "practice",
    fulfilmentType: fulfilmentTypes.size === 1 ? profiles[0].fulfilmentType : "mixed",
    needsPractice: profiles.some((profile) => profile.needsPractice),
    needsSiteAddress: profiles.some((profile) => profile.needsSiteAddress),
    needsPreferredDates: profiles.some((profile) => profile.needsPreferredDates),
    needsTeamDetails: profiles.some((profile) => profile.needsTeamDetails),
    needsEquipmentDetails: profiles.some((profile) => profile.needsEquipmentDetails),
    needsRadiationDetails: profiles.some((profile) => profile.needsRadiationDetails),
    needsDeliveryAddress: profiles.some((profile) => profile.needsDeliveryAddress),
  };
}

export function serviceBookingProfile(input: ProfileInput): ServiceBookingProfile {
  if (input.serviceKey === "custom-package") {
    const selectedKeys = Object.keys(decodeSelection(input.packageSelection));
    return combineProfiles(selectedKeys.map((key) => profileForSingleKey(key)));
  }

  return profileForSingleKey(input.serviceKey, input.serviceSource);
}

export function combinedBookingProfile(items: ProfileInput[]) {
  return combineProfiles(items.map(serviceBookingProfile));
}

export function serviceNeedsTrainer(input: ProfileInput) {
  const profile = serviceBookingProfile(input);
  return (
    profile.needsPreferredDates &&
    profile.fulfilmentType !== "delivery" &&
    profile.fulfilmentType !== "subscription"
  );
}
