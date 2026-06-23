{{ config(materialized='table') }}

-- Most recent available observation per country and indicator. Source values
-- are already non-null (filtered in staging), so the latest year per
-- country/indicator is the most recent non-null value.

with indicators as (

    select * from {{ ref('int_africa_indicators') }}

),

latest as (

    select
        country_code,
        country_name,
        region,
        income_group,
        indicator_code,
        indicator_name,
        year,
        value
    from indicators
    qualify row_number() over (
        partition by country_code, indicator_code
        order by year desc
    ) = 1

)

select * from latest
order by country_name, indicator_code
