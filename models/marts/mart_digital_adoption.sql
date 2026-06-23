with indicators as (

    select * from {{ ref('int_africa_indicators') }}

),

digital_adoption as (

    select
        country_code,
        country_name,
        region,
        year,
        indicator_name,
        value
    from indicators
    where indicator_code in (
            'IT.NET.USER.ZS',   -- Individuals using the Internet (% of population)
            'IT.CEL.SETS.P2'    -- Mobile cellular subscriptions (per 100 people)
        )

)

select * from digital_adoption
order by country_name, year
