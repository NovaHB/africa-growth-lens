{{ config(materialized='table') }}

-- Year-over-year change per country and indicator. previous_year_value is the
-- prior available observation (LAG over year); yoy_change is the difference.

with indicators as (

    select * from {{ ref('int_africa_indicators') }}

),

with_lag as (

    select
        country_code,
        country_name,
        region,
        indicator_code,
        indicator_name,
        year,
        value,
        lag(value) over (
            partition by country_code, indicator_code
            order by year
        ) as previous_year_value
    from indicators

),

yoy as (

    select
        country_code,
        country_name,
        region,
        indicator_code,
        indicator_name,
        year,
        value,
        previous_year_value,
        value - previous_year_value as yoy_change
    from with_lag

)

select * from yoy
where yoy_change is not null
order by country_name, indicator_code, year
