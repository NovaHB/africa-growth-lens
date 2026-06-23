{{ config(materialized='table') }}

with indicators as (

    select * from {{ ref('int_africa_indicators') }}

),

human_development as (

    select
        country_code,
        country_name,
        region,
        income_group,
        year,
        indicator_name,
        value
    from indicators
    where indicator_code in (
            'SE.ADT.LITR.ZS',  -- Literacy rate, adult total (% of people ages 15+)
            'SH.DYN.MORT',     -- Mortality rate, under-5 (per 1,000 live births)
            'SP.DYN.LE00.IN'   -- Life expectancy at birth, total (years)
        )

)

select * from human_development
order by country_name, year
