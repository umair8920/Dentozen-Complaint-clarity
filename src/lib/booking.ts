export type BookingService = {
  value: string;
  label: string;
  paymentLink: string;
  requiresDelegates?: boolean;
};

export const BOOKING_SERVICES: BookingService[] = [
  { value: "mock-inspection", label: "Mock Inspection", paymentLink: "/services" },
  { value: "due-diligence", label: "Due Diligence", paymentLink: "/services" },
  { value: "managed-service", label: "Managed Service", paymentLink: "/services" },
  { value: "new-practice-setup", label: "New Practice Setup", paymentLink: "/squat-practices" },
  {
    value: "training-session",
    label: "Training Session",
    paymentLink: "/pricing",
    requiresDelegates: true,
  },
  { value: "packages", label: "Packages", paymentLink: "/packages" },
  { value: "other", label: "Other", paymentLink: "/contact" },
];

export function getBookingService(value: string) {
  return BOOKING_SERVICES.find((service) => service.value === value);
}
