with vat_categories as (
  select distinct metadata->>'category' as name
  from admin_service_items
  where section in ('pricing', 'build-your-package')
    and nullif(btrim(metadata->>'category'), '') is not null
    and (
      metadata->>'exVat' = 'true'
      or metadata->>'tiered' = 'true'
    )
)
update admin_service_categories c
set
  pricing_note = case
    when c.pricing_note = '' then 'All prices shown ex-VAT. PAT uses tiered pricing: £1.88/item up to 40, then £0.80/item.'
    else c.pricing_note
  end,
  builder_note = case
    when c.builder_note = '' then 'Items marked +VAT are shown ex-VAT in the calculator and can be included in the VAT total.'
    else c.builder_note
  end,
  updated_at = now()
from vat_categories v
where c.name = v.name;
