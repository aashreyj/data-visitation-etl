import os
import mysql.connector
import configparser

# Load database configuration
config_file_path = os.path.join(os.path.dirname(__file__), ".db_config.config")
config = configparser.ConfigParser()
config.read(config_file_path)

# Database connection parameters
db_config = {
    "user": config["conn_info"]["user"],
    "password": config["conn_info"]["password"],
    "host": config["conn_info"]["host"],
    "allow_local_infile": config.getboolean("conn_info", "allow_local_infile"),
}

base_folder_path = "assets/data"
folders = ["import_data", "export_data"]

# Connection to the target MySQL server
mydb = mysql.connector.connect(**db_config)
cursor = mydb.cursor()

cursor.execute("SET GLOBAL local_infile = 1;")

database_name = config["conn_info"]["database"]
create_db_query = f"CREATE DATABASE IF NOT EXISTS {database_name};"
cursor.execute(create_db_query)

mydb.database = database_name

# Loop through each folder (import_data and export_data)
for folder in folders:
    folder_path = os.path.join(base_folder_path, folder)

    # Loop through all files in the folder
    for filename in os.listdir(folder_path):
        if filename.endswith(".csv"):
            table_name = filename.replace(".csv", "")

            create_table_query = f"""
            CREATE TABLE IF NOT EXISTS {table_name} (
                Commodity VARCHAR(100),
                Unit VARCHAR(50),
                Country VARCHAR(100),
                Quantity VARCHAR(50), 
                Value DECIMAL(10, 2)
            );
            """
            cursor.execute(create_table_query)

            delete_query = f"DELETE FROM {table_name};"
            cursor.execute(delete_query)

            load_data_query = f"""
            LOAD DATA LOCAL INFILE '{os.path.join(folder_path, filename)}'
            INTO TABLE {table_name}
            FIELDS TERMINATED BY ',' 
            ENCLOSED BY '"'
            LINES TERMINATED BY '\n' 
            IGNORE 1 ROWS
            (Commodity, Unit, Country, Quantity, Value)
            SET
                Commodity = IF(Commodity = '', '', Commodity),
                Unit = IF(Unit = '', 'KGS', Unit),
                Country = IF(Country = '', '', Country),
                Quantity = IF(Quantity = '', 0, Quantity),
                Value = IF(Value = '', 0.00, Value);
            """
            try:
                cursor.execute(load_data_query)
                print(f"Loaded data from {filename} into {table_name}.")
            except mysql.connector.Error as e:
                print(f"Error loading data from {filename}: {e}")

# Commit changes and clean up connections
mydb.commit()
cursor.close()
mydb.close()

# Print the completion messsage
print("CSV files imported successfully.")
