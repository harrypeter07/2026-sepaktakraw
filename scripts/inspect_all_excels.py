import os
import glob
import pandas as pd
import json

base_dir = r"c:\Users\ASUS\Documents\SECOND SEMISTER\INTERNSHIP\ffff\raw_source"
files = glob.glob(os.path.join(base_dir, "**", "*.xlsx"), recursive=True) + glob.glob(os.path.join(base_dir, "**", "*.xls"), recursive=True)

print(f"Total excel files found: {len(files)}")
summary = {}

for f in files:
    rel_path = os.path.relpath(f, base_dir)
    print(f"\n--- FILE: {rel_path} ---")
    try:
        xl = pd.ExcelFile(f)
        sheet_names = xl.sheet_names
        print(f"Sheets ({len(sheet_names)}): {sheet_names}")
        summary[rel_path] = {}
        for s in sheet_names:
            df = xl.parse(s)
            cols = [str(c).strip() for c in df.columns]
            print(f"  Sheet '{s}': {len(df)} rows, Cols: {cols[:10]}")
            summary[rel_path][s] = {
                "rows": len(df),
                "cols": cols[:15]
            }
    except Exception as e:
        print(f"  Error reading {rel_path}: {e}")

with open("scripts/excel_analysis.json", "w", encoding="utf-8") as out:
    json.dump(summary, out, indent=2)

print("\nWrote analysis to scripts/excel_analysis.json")
