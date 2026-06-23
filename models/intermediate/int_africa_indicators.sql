with countries as (

    select * from {{ ref('stg_wdi_countries') }}

),

indicators as (

    select * from {{ ref('stg_wdi_indicators') }}

),

joined as (

    select
        countries.country_code,
        countries.country_name,
        countries.region,
        countries.income_group,
        indicators.indicator_code,
        indicators.indicator_name,
        indicators.year,
        indicators.value
    from indicators
    inner join countries
        on indicators.country_code = countries.country_code
    where indicators.indicator_code in (
            -- Original curated set
            'NY.GDP.MKTP.KD.ZG',     -- GDP growth rate (annual %)
            'FP.CPI.TOTL.ZG',        -- Inflation, consumer prices (annual %)
            'IT.NET.USER.ZS',        -- Individuals using the Internet (% of population)
            'IT.CEL.SETS.P2',        -- Mobile cellular subscriptions (per 100 people)
            'FX.OWN.TOTL.ZS',        -- Account ownership at a financial institution (% age 15+)
            -- Economic
            'NY.GDP.PCAP.KD',        -- GDP per capita (constant 2015 US$)
            'BX.KLT.DINV.WD.GD.ZS',  -- Foreign direct investment, net inflows (% of GDP)
            'NE.TRD.GNFS.ZS',        -- Trade (% of GDP)
            -- Population
            'SP.POP.TOTL',           -- Population, total
            'SP.URB.TOTL.IN.ZS',     -- Urban population (% of total population)
            'SP.POP.GROW',           -- Population growth (annual %)
            -- Human development & infrastructure
            'EG.ELC.ACCS.ZS',        -- Access to electricity (% of population)
            'SE.ADT.LITR.ZS',        -- Literacy rate, adult total (% of people ages 15+)
            'SH.DYN.MORT',           -- Mortality rate, under-5 (per 1,000 live births)
            'SP.DYN.LE00.IN'         -- Life expectancy at birth, total (years)
        )
        and indicators.year >= 2000

)

select * from joined
