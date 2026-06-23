{{ config(materialized='table') }}

with indicators as (

    select * from {{ ref('int_africa_indicators') }}

),

trade_investment as (

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
            'BX.KLT.DINV.WD.GD.ZS',  -- Foreign direct investment, net inflows (% of GDP)
            'NE.TRD.GNFS.ZS'         -- Trade (% of GDP)
        )

)

select * from trade_investment
order by country_name, year
