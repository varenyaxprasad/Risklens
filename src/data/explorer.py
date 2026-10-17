
import pandas as pd
from pathlib import Path

# Locate the RiskLens project directory
PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw"

# Find CSV files
csv_files = list(RAW_DIR.glob("*.csv"))

if not csv_files:
    raise FileNotFoundError(
        f"No CSV file found inside {RAW_DIR}"
    )

if len(csv_files) > 1:
    raise ValueError(
        f"Multiple CSV files found: {csv_files}. "
        "Keep only the intended dataset or specify its filename."
    )

# Load the dataset
file_path = csv_files[0]
df = pd.read_csv(file_path)

print("\n--- DATASET INFORMATION ---")
print("File:", file_path.name)
print("Shape:", df.shape)

print("\n--- FIRST FIVE ROWS ---")
print(df.head())

print("\n--- COLUMN NAMES ---")
print(df.columns.tolist())
print("\n--- DATA TYPES ---")
print(df.dtypes)

print("\n--- MISSING VALUES ---")
print(df.isnull().sum())

print("\n--- DUPLICATE ROWS ---")
print(df.duplicated().sum())

print("\n--- NUMERICAL SUMMARY ---")
print(df.describe().T)

print("\n--- CATEGORICAL SUMMARY ---")
print(df.describe(include="object").T)
