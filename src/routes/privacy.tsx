import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SDC&T" },
      { name: "description", content: "How Smart Dental Compliance & Training collects, uses and protects your personal data under UK GDPR." },
      { property: "og:title", content: "Privacy Policy — SDC&T" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout>
      <section className="bg-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-GB")}</p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <article className="prose prose-slate mx-auto max-w-3xl text-foreground">
          <p>This Privacy Policy explains how {SITE.company.legalName} (“we”, “us”, “our”) collects, uses, and protects your personal data when you use our website and services. We are committed to handling your information in accordance with the UK GDPR and the Data Protection Act 2018.</p>

          <h2 className="mt-8 text-xl font-bold">1. Who we are</h2>
          <p>{SITE.company.legalName} is the data controller for personal data collected through this website. Company number: {SITE.company.companyNumber}. Registered address: {SITE.company.registeredAddress}.</p>

          <h2 className="mt-8 text-xl font-bold">2. What data we collect</h2>
          <ul className="list-disc pl-6">
            <li>Contact form submissions — name, practice name, email, phone, message.</li>
            <li>Quote/calculator submissions — name, email and the itemised compliance package you selected.</li>
            <li>Booking & payment data — collected and processed by Calendly and its payment partners (Stripe/PayPal).</li>
            <li>Technical data — IP, browser type, pages visited (via cookies/analytics).</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold">3. How we use your data</h2>
          <ul className="list-disc pl-6">
            <li>To respond to enquiries and provide services you request.</li>
            <li>To send quotes you've requested by email.</li>
            <li>To deliver and administer bookings and payments.</li>
            <li>To improve our website and services.</li>
            <li>Where you've opted in, to send relevant updates and resources.</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold">4. Lawful basis</h2>
          <p>We rely on (a) your consent for marketing communications and non-essential cookies; (b) the necessity of performing a contract for service delivery; and (c) our legitimate interests in running and improving our business.</p>

          <h2 className="mt-8 text-xl font-bold">5. Third-party processors</h2>
          <ul className="list-disc pl-6">
            <li>Calendly — bookings and payments.</li>
            <li>Stripe / PayPal — payment processing.</li>
            <li>Email delivery providers — to send quotes, confirmations and resources.</li>
            <li>Analytics providers — to understand site usage.</li>
          </ul>

          <h2 className="mt-8 text-xl font-bold">6. Data retention</h2>
          <p>We retain personal data only for as long as needed to fulfil the purposes set out above or as required by law (typically up to 6 years for financial records).</p>

          <h2 className="mt-8 text-xl font-bold">7. Your rights</h2>
          <p>You have the right to access, rectify, erase or restrict processing of your personal data, to data portability, and to object to certain processing. You can also withdraw consent at any time. To exercise these rights, email <a href={`mailto:${SITE.email}`} className="text-magenta underline">{SITE.email}</a>.</p>

          <h2 className="mt-8 text-xl font-bold">8. Cookies</h2>
          <p>We use essential cookies to make the site work and, with your consent, analytics cookies to improve it. You can manage your preferences via the cookie banner.</p>

          <h2 className="mt-8 text-xl font-bold">9. Contact</h2>
          <p>For data requests or questions, contact us at <a href={`mailto:${SITE.email}`} className="text-magenta underline">{SITE.email}</a>. You also have the right to lodge a complaint with the UK Information Commissioner's Office (ICO) at ico.org.uk.</p>
        </article>
      </section>
    </SiteLayout>
  );
}
