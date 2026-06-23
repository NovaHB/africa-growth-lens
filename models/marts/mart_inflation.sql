{{ config(materialized='table') }}

with indicators as (

    select * from {{ ref('int_africa_indicators') }}

),

inflation as (

    select
        country_code,
        country_name,
        region,
        income_group,
        year,
        value as inflation_rate
    from indicators
    where indicator_code = 'FP.CPI.TOTL.ZG'

)

select * from inflation
order by country_name, year
