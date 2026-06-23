{{ config(materialized='table') }}

-- Average indicator value across countries within each income group, per year.

with indicators as (

    select * from {{ ref('int_africa_indicators') }}

),

summary as (

    select
        income_group,
        indicator_code,
        indicator_name,
        year,
        avg(value) as avg_value,
        count(distinct country_code) as country_count
    from indicators
    group by
        income_group,
        indicator_code,
        indicator_name,
        year

)

select * from summary
order by indicator_code, income_group, year
