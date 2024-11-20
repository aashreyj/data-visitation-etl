<H1 style="text-align: center;"> CS6.302: Software Systems Development </H1>
<H3 style="text-align: center;"> Database Component </H3>

## Description

This directory contains the scripts that import the CSV data to the MySQL database. There are two scripts:
- `load_csv_to_db.py`: Reads the CSV data present in the `../assets/data` directory and loads them to the database specified in the `.db_config.config` file of the local MySQL instance.
- `data_transformation.py`: Uses the data read in the first script to create tables for ETL and analytics purpose.

## How To Execute:

1. Create a Python virtual environment to install the necessary dependencies.
2. Activate the virtualenv using the command `source <virtualenv name>/bin/activate`
3. Install the dependencies using the command `pip3 install -r requirements.txt`
4. Enter DB configuration parameters in the `.db_config.config` file, mentioning the local MySQL `username`, `password` and desired `database name` for data loading.
    - Ensure that the user mentioned above has `superuser` privileges on the database.
5. Ensure that the CSV files are present in the `assets/data` directory.
6. Run `python3 load_csv_to_db.py` from terminal. The CSV files get imported to the local database.
7. Run `python3 data_transformation.py` to clean, load, and process the data into the respective tables.
