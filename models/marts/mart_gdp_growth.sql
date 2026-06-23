with indicators as (

    select * from {{ ref('int_africa_indicators') }}

),

gdp_growth as (

    select
        country_code,
        country_name,
        region,
        income_group,
        year,
        value as gdp_growth_rate
    from indicators
    where indicator_code = 'NY.GDP.MKTP.KD.ZG'

)

select * from gdp_growth
order by country_name, year
