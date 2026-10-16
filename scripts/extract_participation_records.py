import pandas as pd
import json
import re

file_path = r"raw_source\drive_download\MSTA Record.xlsx"
xl = pd.ExcelFile(file_path)

# --- 1. District Participation Record ---
df_part = xl.parse("District Participation Record", header=None)

# Row 1 has years: 2021-22 (cols 2-7), 2022-23 (cols 8-13), 2023-24 (cols 14-19), 2024-25 (cols 20-25)
# Row 2 has division: Senior, Junior, Sub-Junior
# Row 3 has gender: Men/Women/Boys/Girls

participation_by_district = []
seasons = ["2021-22", "2022-23", "2023-24", "2024-25"]

for r in range(4, len(df_part)):
    row = df_part.iloc[r]
    sr_no = row[0]
    district = row[1]
    if pd.isna(district):
        continue
    district = str(district).strip()
    if district.lower() in ['total', 'grand total']:
        continue

    dist_data = {
        "srNo": int(sr_no) if pd.notna(sr_no) and str(sr_no).isdigit() else r - 3,
        "district": district,
        "history": {}
    }

    # Extract 4 seasons
    col_idx = 2
    for season in seasons:
        dist_data["history"][season] = {
            "seniorMen": int(row[col_idx]) if pd.notna(row[col_idx]) and str(row[col_idx]).isdigit() else 0,
            "seniorWomen": int(row[col_idx+1]) if pd.notna(row[col_idx+1]) and str(row[col_idx+1]).isdigit() else 0,
            "juniorBoys": int(row[col_idx+2]) if pd.notna(row[col_idx+2]) and str(row[col_idx+2]).isdigit() else 0,
            "juniorGirls": int(row[col_idx+3]) if pd.notna(row[col_idx+3]) and str(row[col_idx+3]).isdigit() else 0,
            "subJuniorBoys": int(row[col_idx+4]) if pd.notna(row[col_idx+4]) and str(row[col_idx+4]).isdigit() else 0,
            "subJuniorGirls": int(row[col_idx+5]) if pd.notna(row[col_idx+5]) and str(row[col_idx+5]).isdigit() else 0,
        }
        dist_data["history"][season]["total"] = sum(dist_data["history"][season].values())
        col_idx += 6

    # Calculate overall total athletes fielded across all 4 years
    dist_data["allTimeAthletes"] = sum(dist_data["history"][s]["total"] for s in seasons)
    participation_by_district.append(dist_data)

# Sort by all-time athletes
participation_by_district.sort(key=lambda x: x["allTimeAthletes"], reverse=True)

# Season totals for chart/diagram
season_summaries = {}
for s in seasons:
    season_summaries[s] = {
        "seniorMen": sum(d["history"][s]["seniorMen"] for d in participation_by_district),
        "seniorWomen": sum(d["history"][s]["seniorWomen"] for d in participation_by_district),
        "juniorBoys": sum(d["history"][s]["juniorBoys"] for d in participation_by_district),
        "juniorGirls": sum(d["history"][s]["juniorGirls"] for d in participation_by_district),
        "subJuniorBoys": sum(d["history"][s]["subJuniorBoys"] for d in participation_by_district),
        "subJuniorGirls": sum(d["history"][s]["subJuniorGirls"] for d in participation_by_district),
    }
    season_summaries[s]["grandTotal"] = sum(season_summaries[s].values())

output = {
    "seasons": seasons,
    "seasonSummaries": season_summaries,
    "districts": participation_by_district
}

with open("lib/participation-records.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2)

print(f"Successfully extracted participation records for {len(participation_by_district)} districts into lib/participation-records.json")
for s, stats in season_summaries.items():
    print(f" Season {s}: {stats['grandTotal']} total athletes fielded (Men: {stats['seniorMen']}, Women: {stats['seniorWomen']}, Youth: {stats['juniorBoys']+stats['juniorGirls']+stats['subJuniorBoys']+stats['subJuniorGirls']})")
