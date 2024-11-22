import pandas as pd
import mysql.connector
import configparser
import os
import warnings

# Suppress warnings
warnings.filterwarnings("ignore")

# Load database configuration
config_file_path = os.path.join(os.path.dirname(__file__), ".db_config.config")
config = configparser.ConfigParser()
config.read(config_file_path)

# Database connection parameters
user = config["conn_info"]["user"]
password = config["conn_info"]["password"]
host = config["conn_info"]["host"]
source_db = config["conn_info"]["database"]

conn_source = mysql.connector.connect(
    user=user, password=password, host=host, database=source_db
)

commodities_map = {
    "agriculture": [
        "Cashew",
        "Coffee",
        "Groundnut",
        "Pulses",
        "Sugar",
        "Spices",
        "Tea",
        "Wheat",
    ]
}

# Connection to the target MySQL server
conn_target = mysql.connector.connect(
    user=user,
    password=password,
    host=host,
)

# Cursor for the target connection
cursor_target = conn_target.cursor()

# Load country to continent mapping
country_continent_file = os.path.join(
    "assets/data", "region_data", "country_continent_mapping.csv"
)
country_continent_mapping = pd.read_csv(country_continent_file)

# Mapping country names to continents, ensuring case-insensitivity
country_to_continent = dict(
    zip(
        country_continent_mapping["Country"].str.lower(),
        country_continent_mapping["Continent"],
    )
)


# Function to create databases for each supercommodity
def create_database(supercommodity):
    for data_type in ["import_data", "export_data"]:
        db_name = f"{data_type}_{supercommodity.lower()}"
        cursor_target.execute(f"CREATE DATABASE IF NOT EXISTS {db_name};")


# Create databases for each supercommodity
for supercommodity in commodities_map.keys():
    create_database(supercommodity)


# Function to clear tables at the start of the script execution
def create_tables():
    for supercommodity, commodities in commodities_map.items():
        for data_type in ["import_data", "export_data"]:
            db_name = f"{data_type}_{supercommodity.lower()}"
            cursor_target.execute(f"USE {db_name};")

            for commodity in commodities:
                table_name = f"{data_type}_{commodity.lower().replace(' ', '_')}"

                drop_table_query = f"DROP TABLE IF EXISTS {table_name};"
                cursor_target.execute(drop_table_query)

                create_table_query = f"""
                CREATE TABLE IF NOT EXISTS {table_name} (
                    Continent VARCHAR(100),
                    Country VARCHAR(100),
                    Quantity DECIMAL(18, 2),
                    Value DECIMAL(18, 2),
                    Year VARCHAR(20)
                );
                """
                cursor_target.execute(create_table_query)


# Function to process both import and export data
def process_data(data_type):
    query = f"SHOW TABLES LIKE '{data_type}_%';"
    tables_df = pd.read_sql(query, conn_source)

    processed_years = set()

    for table in tables_df.values.flatten():
        year_range = f"{table.split('_')[2]}_{table.split('_')[3]}"

        if year_range not in processed_years:
            processed_years.add(year_range)

        for supercommodity, commodities in commodities_map.items():
            for commodity in commodities:
                db_name = f"{data_type}_{supercommodity.lower()}"
                cursor_target.execute(f"USE {db_name};")

                table_name = f"{data_type}_{commodity.lower().replace(' ', '_')}"
                select_query = f"""
                SELECT Unit, Country, Quantity, Value 
                FROM {source_db}.{table} 
                WHERE Commodity = '{commodity}';
                """

                data = pd.read_sql(select_query, conn_source)

                if not data.empty:
                    data["Year"] = year_range

                    data["Country"] = data["Country"].str.strip().str.title()

                    data["Continent"] = data["Country"].apply(
                        lambda x: country_to_continent.get(x.lower(), None)
                    )

                    data = data.dropna(subset=["Continent"])

                    # If the DataFrame is empty after dropping NaNs, skip further processing
                    if data.empty:
                        continue

                    data["Quantity"] = pd.to_numeric(data["Quantity"], errors="coerce")

                    data["Quantity"] = data["Quantity"].round(2)

                    unit = data.iloc[0]["Unit"]
                    scale_factor = 1
                    if unit.lower() == "kgs":
                        scale_factor = 0.001
                    elif unit.lower() == "gm":
                        scale_factor = 0.000001

                    data["Quantity"] = data["Quantity"] * scale_factor
                    data = data.drop(columns=["Unit"])

                    for _, row in data.iterrows():
                        insert_query = f"""
                        INSERT INTO {table_name} (Continent, Country, Quantity, Value, Year) 
                        VALUES (%s, %s, %s, %s, %s);
                        """

                        try:
                            cursor_target.execute(
                                insert_query,
                                (
                                    row["Continent"],
                                    row["Country"],
                                    row["Quantity"],
                                    row["Value"],
                                    row["Year"],
                                ),
                            )
                        except mysql.connector.Error as e:
                            print(f"Error inserting data: {e}")

        print(
            f"Completed processing {data_type} for year range: {year_range} across all commodities in {supercommodity}"
        )
        conn_target.commit()


# Clear all tables at the start of the script execution
create_tables()

# Process import and export data
process_data("import_data")
process_data("export_data")

# Commit changes to the target database
conn_target.commit()

# Clean up connections
cursor_target.close()
conn_source.close()
conn_target.close()

# Print the completion message
print("Data transfer complete.")
