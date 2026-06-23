{{ config(materialized='table') }}

with indicators as (

    select * from {{ ref('int_africa_indicators') }}

),

gdp_per_capita as (

    select
        country_code,
        country_name,
        region,
        income_group,
        year,
        value as gdp_per_capita
    from indicators
    where indicator_code = 'NY.GDP.PCAP.KD'

)

select * from gdp_per_capita
order by country_name, year
