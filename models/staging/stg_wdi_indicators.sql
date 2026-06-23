with source as (

    select * from {{ source('world_bank_wdi', 'indicators_data') }}

),

renamed as (

    select
        country_code,
        indicator_code,
        indicator_name,
        year,
        value
    from source
    where value is not null

)

select * from renamed
