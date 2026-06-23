# Africa Growth Lens

A dbt + BigQuery analytics pipeline that transforms World Bank development data
into clean, analysis-ready datasets on the economic, social, and digital growth
of African nations — surfaced through an interactive dashboard.

---

## 1. Project Overview

**Africa Growth Lens** turns the World Bank's World Development Indicators (WDI)
into a curated, queryable picture of how African economies are growing.

The raw WDI dataset is massive, sparse, and stored in a long "indicator code"
format that is hard to analyse directly. This project uses **dbt** to filter it
down to **69 African countries** (Sub-Saharan Africa and Middle East & North
Africa), a focused set of **15 development indicators**, and the years **2000
onwards** — then reshapes that data into purpose-built marts for GDP, inflation,
digital adoption, demographics, trade, human development, and cross-country
rankings.

**Why it was built:**

- To make African development data **accessible** — no SQL-on-raw-WDI required.
- To demonstrate a **layered analytics engineering workflow** (staging →
  intermediate → marts) with tested, documented models.
- To power a **public dashboard** that tells the story of African growth through
  clear, comparable metrics.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                  bigquery-public-data.world_bank_wdi                  │
│                  (country_summary  +  indicators_data)                │
└───────────────────────────────┬─────────────────────────────────────┘
                                 │  source()
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STAGING (views)                                                      │
│  stg_wdi_countries   ·   stg_wdi_indicators                          │
│  clean + rename, filter to African countries / non-null values       │
└───────────────────────────────┬─────────────────────────────────────┘
                                 │  ref()
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  INTERMEDIATE (view)                                                  │
│  int_africa_indicators                                                │
│  join countries × indicators, 15 indicator codes, year >= 2000       │
└───────────────────────────────┬─────────────────────────────────────┘
                                 │  ref()
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  MARTS (tables)                                                       │
│  13 analytics-ready models: per-topic slices, rankings, YoY,         │
│  latest-value snapshots, and group/region aggregates                 │
└───────────────────────────────┬─────────────────────────────────────┘
                                 │  scripts/export_to_json.py
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  data/*.json   →   React dashboard   →   Netlify                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Source

| | |
|---|---|
| **Dataset** | [World Bank World Development Indicators (WDI)](https://console.cloud.google.com/marketplace/details/the-world-bank/wdi) |
| **Location** | `bigquery-public-data.world_bank_wdi` (BigQuery public dataset, US) |
| **Tables used** | `country_summary` (country attributes), `indicators_data` (long-format values) |
| **Scope** | 69 African countries — 48 Sub-Saharan Africa + 21 Middle East & North Africa |
| **Time range** | 2000 onwards (data currently available through 2020) |

The WDI dataset is free to query on BigQuery; you only pay for bytes scanned
against your own Google Cloud project.

---

## 4. Models

The project has **16 models** across three layers (**13 of them are marts**).

### Staging (views) — clean & rename source data
| Model | Description |
|---|---|
| `stg_wdi_countries` | African countries (SSA + MENA) with cleaned code, name, region, income group, currency. |
| `stg_wdi_indicators` | Long-format indicator values with non-null values only. |

### Intermediate (view) — the analytical core
| Model | Description |
|---|---|
| `int_africa_indicators` | Countries joined to the 15 curated indicators, filtered to year ≥ 2000. |

### Marts (tables) — analysis-ready outputs
| Model | Description |
|---|---|
| `mart_gdp_growth` | Annual GDP growth rate per country and year. |
| `mart_gdp_per_capita` | GDP per capita (constant 2015 US$) per country and year. |
| `mart_inflation` | Consumer-price inflation rate per country and year. |
| `mart_digital_adoption` | Internet usage and mobile subscriptions per country and year. |
| `mart_electricity_access` | Access to electricity (% of population) per country and year. |
| `mart_population_trends` | Total population, urban share, and population growth per country and year. |
| `mart_trade_investment` | Foreign direct investment and trade (both % of GDP) per country and year. |
| `mart_human_development` | Literacy, under-5 mortality, and life expectancy per country and year. |
| `mart_country_rankings` | Countries ranked against each other on each indicator's latest year. |
| `mart_yoy_changes` | Year-over-year change per country and indicator (LAG window function). |
| `mart_country_latest` | Most recent available value per country per indicator (QUALIFY + ROW_NUMBER). |
| `mart_income_group_summary` | Indicator averages and country counts by income group and year. |
| `mart_regional_summary` | Indicator averages and country counts by region and year. |

---

## 5. Indicators Covered

15 World Bank WDI indicators, grouped by theme:

### Economy
| Code | Measures |
|---|---|
| `NY.GDP.MKTP.KD.ZG` | GDP growth (annual %) |
| `NY.GDP.PCAP.KD` | GDP per capita (constant 2015 US$) |
| `FP.CPI.TOTL.ZG` | Inflation, consumer prices (annual %) |
| `BX.KLT.DINV.WD.GD.ZS` | Foreign direct investment, net inflows (% of GDP) |
| `NE.TRD.GNFS.ZS` | Trade (% of GDP) |

### Digital & Infrastructure
| Code | Measures |
|---|---|
| `IT.NET.USER.ZS` | Individuals using the Internet (% of population) |
| `IT.CEL.SETS.P2` | Mobile cellular subscriptions (per 100 people) |
| `FX.OWN.TOTL.ZS` | Account ownership at a financial institution or mobile-money provider (% age 15+) |
| `EG.ELC.ACCS.ZS` | Access to electricity (% of population) |

### Population
| Code | Measures |
|---|---|
| `SP.POP.TOTL` | Population, total |
| `SP.POP.GROW` | Population growth (annual %) |
| `SP.URB.TOTL.IN.ZS` | Urban population (% of total population) |

### Human Development
| Code | Measures |
|---|---|
| `SE.ADT.LITR.ZS` | Literacy rate, adult total (% of people ages 15+) |
| `SH.DYN.MORT` | Mortality rate, under-5 (per 1,000 live births) |
| `SP.DYN.LE00.IN` | Life expectancy at birth, total (years) |

> **Note:** survey-based indicators (`FX.OWN.TOTL.ZS`, `SE.ADT.LITR.ZS`) are
> reported irregularly, so they have sparser coverage than annually-collected
> series.

---

## 6. Tech Stack

| Layer | Technology |
|---|---|
| Transformation | **dbt Core** (`dbt-bigquery` adapter) |
| Data warehouse | **Google BigQuery** |
| Export / scripting | **Python** (`google-cloud-bigquery`, `pandas`) |
| Frontend | **React** dashboard consuming `data/*.json` |
| Hosting | **Netlify** |

---

## 7. How to Run

### Prerequisites
- Python 3.12 (3.14 is not yet supported by the dbt dependency stack)
- A Google Cloud project with BigQuery enabled
- A service-account JSON key with BigQuery Job User + Data Viewer roles

### 1. Set up a virtual environment & install dependencies
```bash
python -m venv .venv
source .venv/bin/activate           # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure your dbt profile
Create `~/.dbt/profiles.yml` (kept out of the repo by `.gitignore`):
```yaml
africa_growth_lens:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: service-account
      keyfile: /path/to/your-service-account-key.json
      project: your-gcp-project-id
      dataset: africa_growth_lens
      location: US
      threads: 4
      job_execution_timeout_seconds: 300
      job_retries: 1
```

### 3. Build the models
```bash
dbt debug      # verify the BigQuery connection
dbt run        # build staging → intermediate → marts
dbt test       # run data tests
dbt docs generate && dbt docs serve   # browse the model docs (optional)
```

### 4. Export marts to JSON for the dashboard
```bash
python scripts/export_to_json.py      # writes data/*.json
```

---

## 8. Dashboard

🔗 **Live dashboard:** _coming soon_ — `https://<your-site>.netlify.app`

> Placeholder: replace with the deployed Netlify URL once the React frontend is
> published.

---

_Built with dbt and BigQuery on the World Bank's open data._
