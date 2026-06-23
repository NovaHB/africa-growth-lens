{{ config(materialized='table') }}

-- Ranks African countries against each other on each indicator, using the
-- latest year for which that indicator has data. Higher value = rank 1.

with indicators as (

    select * from {{ ref('int_africa_indicators') }}

),

latest_year as (

    select
        indicator_code,
        max(year) as latest_year
    from indicators
    group by indicator_code

),

latest_values as (

    select
        i.indicator_code,
        i.indicator_name,
        i.year,
        i.country_code,
        i.country_name,
        i.region,
        i.income_group,
        i.value
    from indicators i
    inner join latest_year ly
        on i.indicator_code = ly.indicator_code
        and i.year = ly.latest_year

),

ranked as (

    select
        indicator_code,
        indicator_name,
        year,
        country_code,
        country_name,
        region,
        income_group,
        value,
        rank() over (
            partition by indicator_code
            order by value desc
        ) as country_rank
    from latest_values

)

select * from ranked
order by indicator_code, country_rank
