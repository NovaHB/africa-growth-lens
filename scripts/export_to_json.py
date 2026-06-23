"""Export africa_growth_lens BigQuery marts to JSON files.

Reads the dbt mart tables from BigQuery and writes one JSON file per mart into
the project-root `data/` folder.
"""

from pathlib import Path

import pandas as pd
from google.cloud import bigquery

# --- Configuration -----------------------------------------------------------
KEYFILE = r"C:\Users\NOVEMH\.dbt\africa-growth-lens-94c792f80cfd.json"
PROJECT = "africa-growth-lens"
DATASET = "africa_growth_lens"
LOCATION = "US"

# mart table name -> output JSON filename
EXPORTS = {
    "mart_gdp_growth": "gdp_growth.json",
    "mart_digital_adoption": "digital_adoption.json",
    "mart_gdp_per_capita": "gdp_per_capita.json",
    "mart_population_trends": "population_trends.json",
    "mart_trade_investment": "trade_investment.json",
    "mart_human_development": "human_development.json",
    "mart_electricity_access": "electricity_access.json",
    "mart_country_rankings": "country_rankings.json",
    "mart_yoy_changes": "yoy_changes.json",
    "mart_income_group_summary": "income_group_summary.json",
}

# Project root is the parent of this script's `scripts/` directory.
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"


def main() -> None:
    client = bigquery.Client.from_service_account_json(KEYFILE, location=LOCATION)
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    for table, filename in EXPORTS.items():
        query = f"SELECT * FROM `{PROJECT}.{DATASET}.{table}`"
        df = client.query(query).to_dataframe()

        out_path = DATA_DIR / filename
        df.to_json(out_path, orient="records", indent=2)

        print(f"{table}: exported {len(df)} rows -> {out_path}")


if __name__ == "__main__":
    main()
