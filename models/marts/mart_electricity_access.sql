{{ config(materialized='table') }}

with indicators as (

    select * from {{ ref('int_africa_indicators') }}

),

electricity_access as (

    select
        country_code,
        country_name,
        region,
        income_group,
        year,
        value as electricity_access_pct
    from indicators
    where indicator_code = 'EG.ELC.ACCS.ZS'

)

select * from electricity_access
order by country_name, year
