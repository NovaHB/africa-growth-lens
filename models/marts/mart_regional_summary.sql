{{ config(materialized='table') }}

-- Average indicator value across countries within each region, per year.

with indicators as (

    select * from {{ ref('int_africa_indicators') }}

),

summary as (

    select
        region,
        indicator_code,
        indicator_name,
        year,
        avg(value) as avg_value,
        count(distinct country_code) as country_count
    from indicators
    group by
        region,
        indicator_code,
        indicator_name,
        year

)

select * from summary
order by indicator_code, region, year
