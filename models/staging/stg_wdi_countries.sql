with source as (

    select * from {{ source('world_bank_wdi', 'country_summary') }}

),

renamed as (

    select
        country_code,
        short_name      as country_name,
        region,
        income_group,
        currency_unit
    from source
    where region in ('Sub-Saharan Africa', 'Middle East & North Africa')

)

select * from renamed
