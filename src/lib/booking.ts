export type BookingService = {
  value: string;
  label: string;
  paymentLink: string;
  requiresDelegates?: boolean;
};

export const BOOKING_SERVICES: BookingService[] = [
  { value: "consultation", label: "Free compliance consultation", paymentLink: "/contact" },
  { value: "mock-inspection", label: "Mock Inspection", paymentLink: "/pricing" },
  { value: "due-diligence", label: "Due Diligence", paymentLink: "/pricing" },
  { value: "managed-service", label: "Managed Service", paymentLink: "/packages" },
  { value: "new-practice-setup", label: "New Practice Setup", paymentLink: "/squat-practices" },
  {
    value: "training-session",
    label: "Training Session",
    paymentLink: "/pricing",
    requiresDelegates: true,
  },
  { value: "packages", label: "Packages", paymentLink: "/packages" },
  {
    value: "cqc-registration",
    label: "CQC registration support",
    paymentLink: "/squat-practices",
  },
  {
    value: "cqc-appeal",
    label: "CQC application appeal support",
    paymentLink: "/squat-practices",
  },
];

export function getBookingService(value: string) {
  return BOOKING_SERVICES.find((service) => service.value === value);
}
