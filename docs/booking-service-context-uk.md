# UK dental compliance service and booking model

## Regulatory scope

The website markets UK dental compliance services, but CQC registration and CQC inspection
support apply to England. Practices in Scotland, Wales and Northern Ireland have different care
regulators and may also have nation-specific healthcare guidance. The booking intake therefore
records the nation of the service location instead of assuming every UK customer is under CQC.

Primary references:

- CQC, registration and locations:
  https://www.cqc.org.uk/guidance-regulation/registration/register-provider
- CQC, statement of purpose:
  https://www.cqc.org.uk/guidance-regulation/registration/statement-purpose
- CQC, infection prevention and control for dental providers:
  https://www.cqc.org.uk/guidance-providers/dentists/dental-mythbuster-38-infection-prevention-and-control

## What each service represents

| Service family                                                     | Customer scope                                             | Normal fulfilment                                               | Booking information needed                                                                            |
| ------------------------------------------------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Fire, legionella, health and safety, disability access assessments | One practice site                                          | On-site assessment and report                                   | Exact site, responsible contact, preferred dates, access notes, relevant premises/equipment context   |
| BLS, ILS, cross-infection, safeguarding, complaints training       | A team at one practice, or a remote cohort                 | On-site or remote session, attendance evidence and certificates | Site or online preference, delegate count, team size, dates, time, adjustments                        |
| PAT, emergency lighting, extinguishers, fire alarm and PVI         | One practice site and its assets                           | On-site inspection/test/service, report or certificate          | Exact site, asset quantities, access, dates, current due information where known                      |
| RPA service                                                        | The radiation employer/practice and its X-ray installation | Ongoing advisory subscription, not a single appointment         | Legal/practice identity, site, number of X-ray units, current RPA expiry/start date                   |
| Mock inspection and new-practice/CQC support                       | Whole practice/provider and relevant locations             | Remote preparation plus possible site work                      | Provider/practice identity, nation, site, contact role, dates and notes                               |
| Role logbooks/resources                                            | Recipient/order                                            | Delivery or digital fulfilment                                  | Recipient and delivery details; no appointment dates                                                  |
| Ready-made or custom packages                                      | Usually a whole practice and one site                      | Mixed workstreams                                               | Common practice/site onboarding plus conditional team, asset and RPA fields based on package contents |

## Important UK compliance context

### Fire risk assessment

The Regulatory Reform (Fire Safety) Order 2005 applies to non-domestic premises in England and
Wales. The responsible person must arrange a suitable and sufficient fire risk assessment and keep
it up to date. The system should not state that every assessment has one universal annual expiry:
the review should follow risk, material changes and the assessor's recommendations.

Reference:
https://www.gov.uk/government/publications/people-with-duties-under-fire-safety-laws/a-guide-for-persons-with-duties-under-fire-safety-legislation-accessible

### Legionella

Dutyholders must identify and assess risk, implement a control scheme where needed, appoint a
competent responsible person and keep suitable records. Review timing is risk- and change-based,
not a universal annual certificate rule.

References:

- https://www.hse.gov.uk/pubns/books/l8.htm
- https://www.hse.gov.uk/legionnaires/hot-and-cold.htm

### Pressure systems: autoclaves and compressors

Qualifying systems need a written scheme of examination before use and examination by a competent
person in accordance with that scheme. The next examination date should therefore come from the
written scheme/report rather than a hard-coded website interval.

References:

- https://www.hse.gov.uk/pressure-systems/pssr.htm
- https://www.hse.gov.uk/pubns/indg178.htm

### PAT

UK law requires work electrical equipment to be maintained safely, but does not require every
portable appliance to receive an annual PAT test. Inspection/testing frequency is risk-based. The
application should store the actual service date, item count, result and recommended next review,
without presenting “annual PAT” as a universal legal rule.

References:

- https://www.hse.gov.uk/electricity/faq-portable-appliance-testing.htm
- https://www.hse.gov.uk/pubns/indg236.htm

### RPA

Under IRR17, a radiation employer must consult a suitable Radiation Protection Adviser on specified
matters. A booking is practice/employer-level ongoing coverage, not an individual staff booking.
The intake needs the site and X-ray equipment count, and lifecycle management needs the start/expiry
date.

References:

- https://www.hse.gov.uk/radiation/rpnews/rpa.htm
- https://www.hse.gov.uk/pubns/books/l121.htm

### BLS and medical emergencies

Dental professionals should follow Resuscitation Council UK guidance. Primary dental care staff
should update resuscitation knowledge and skills at least annually, and training should be recorded.
The booking therefore needs delegate count and should produce attendance/certificate records per
course or participant.

References:

- https://www.cqc.org.uk/guidance-providers/dentists/dental-mythbuster-4-drugs-equipment-medical-emergency
- https://www.resus.org.uk/library/quality-standards-cpr/primary-dental-care

### Infection prevention and control

Practices need effective IPC governance, policies, audits, designated responsibility, and initial
and ongoing staff training that is updated and recorded. Cross-infection training is a team service;
it should retain attendance and evidence, not only an appointment date.

References:

- https://www.cqc.org.uk/guidance-providers/dentists/dental-mythbuster-38-infection-prevention-and-control
- https://www.gov.uk/government/publications/the-health-and-social-care-act-2008-code-of-practice-on-the-prevention-and-control-of-infections-and-related-guidance/health-and-social-care-act-2008-code-of-practice-on-the-prevention-and-control-of-infections-and-related-guidance

## Lifecycle used by the application

`status` remains backward-compatible (`selected`, `booked`, `cancelled`). Operational work uses
`workflow_status`:

1. `selected`
2. `submitted`
3. `triage`
4. `quoted`
5. `confirmed`
6. `in_progress`
7. `completed`
8. `cancelled`

Preferred dates are customer options, not confirmed appointments. `confirmed_start` and
`confirmed_end` must be used for the actual appointment and the 72-hour cancellation calculation.

For recurring compliance management, each completed service can retain:

- `completed_at`
- `next_due_date`
- `certificate_sent_at`
- `supplier_name`
- `booking_details` for service-specific structured data
- `legacy_import` for unreconciled spreadsheet values and provenance

## Spreadsheet migration mapping

The uploaded Platinum tracker combines practice master data and many service occurrences in one
row. It should be migrated as separate service lifecycle records, not copied into one appointment.

| Spreadsheet value                                                      | Target                                                                                                    |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Practice                                                               | practice/business identity and booking `practice_name`                                                    |
| Contact                                                                | contact record or `booking_details.legacyContact` until email/phone are known                             |
| “Last done”                                                            | `completed_at` or preserved month-level value in `legacy_import`                                          |
| “Next due” / RPA expiry                                                | `next_due_date`                                                                                           |
| Certificate sent                                                       | `certificate_sent_at` when a real date is known; otherwise a certificate workflow flag in `legacy_import` |
| PAT item count and amount                                              | `booking_details.equipmentSummary` plus raw value in `legacy_import`                                      |
| Supplier names (Independent Inspection, Vital, CompleteRPA, Direct365) | `supplier_name`                                                                                           |
| “No record”, “Unknown”, “Not done by us”                               | preserve exactly in `legacy_import`; do not invent dates                                                  |
| Fire-testing opt-in and notes                                          | service-specific booking details/notes                                                                    |

Rows only containing a month and year must not be converted to a fake exact day. Keep the original
text in `legacy_import` until the source certificate or invoice supplies the precise date.
