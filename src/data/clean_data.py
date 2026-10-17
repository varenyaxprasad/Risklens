import pandas as pd
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

file_path = RAW_DIR / "Loan_default.csv"

if not file_path.exists():
    raise FileNotFoundError(f"Dataset not found: {file_path}")

df = pd.read_csv(file_path)

print("Original shape:", df.shape)

df.columns = df.columns.str.strip()

string_columns = df.select_dtypes(include="str").columns

for column in string_columns:
    df[column] = df[column].str.strip()
    
if "Default" not in df.columns:
    raise ValueError("Target column 'Default' not found.")

print("\nTarget values:")
print(df["Default"].value_counts(dropna=False))

if df["Default"].isna().any():
    raise ValueError("Default contains missing values.")

if not df["Default"].isin([0, 1]).all():
    raise ValueError("Default contains values other than 0 and 1.")

if "LoanID" in df.columns:
    print("\nUnique LoanIDs:", df["LoanID"].nunique())
    print("Total rows:", len(df))
    
print("\nNumerical minimums:")
print(df.select_dtypes(include="number").min())

print("\nNumerical maximums:")
print(df.select_dtypes(include="number").max())

categorical_columns = df.select_dtypes(include="str").columns

for column in categorical_columns:
    print(f"\n{column}:")
    print(df[column].value_counts(dropna=False))


PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

output_path = PROCESSED_DIR / "Loan_default_cleaned.csv"
df.to_csv(output_path, index=False)

print("\nCleaned dataset saved to:", output_path)
print("Final shape:", df.shape)
