{{ config(materialized='table') }}

with indicators as (

    select * from {{ ref('int_africa_indicators') }}

),

population_trends as (

    select
        country_code,
        country_name,
        region,
        year,
        indicator_name,
        value
    from indicators
    where indicator_code in (
            'SP.POP.TOTL',        -- Population, total
            'SP.URB.TOTL.IN.ZS',  -- Urban population (% of total population)
            'SP.POP.GROW'         -- Population growth (annual %)
        )

)

select * from population_trends
order by country_name, year
