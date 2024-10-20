<H1 style="text-align: center;"> CS6.302: Software Systems Development </H1>
<H3 style="text-align: center;"> Course Project: Data Visualisation - ETL </H3>

## Details: Team #10

### Members:
Kanika Aapan - 2024201021 - M.Tech in CSE  
Khooshi Popat - 2024201069 - M.Tech in CSE  
Ashima Mathur - 2024201073 - M.Tech in CSE  
Aashrey Jain - 2024202012 - M.Tech in CSIS  
Deepesh Vendoti - 2024204013 - M.Tech in PDM

## Introduction

Through this project, we aim to provide a dashboard that will help the user in visualizing India’s import and export data between the years 2017 and 2023. We want to provide the option for visualizing the cumulative trends over this period as well as year-wise data.

We also want to provide an option for the user to see the raw data based on the filters applied by them, on
a separate screen.

The dataset that we have chosen can be found under the following catalogues of the Government of India datasets:

a. Import data: [Import Data Catalog](https://www.data.gov.in/catalog/principal-commodity-wise-import)  
b. Export data: [Export Data Catalog](https://www.data.gov.in/catalog/principal-commodity-wise-export)

Due to the Covid-19 pandemic, the data is not available for the period 2020-21 so we will skip that year. The datasets contain the import and export data (value in Million USD and quantity in Kgs) for each commodity and country that trades with India.

## System Design

The project requires full stack development to provide seamless visualization of the underlying data. The underlying components are:

- Front End: The front-end of the application will be built using HTML, CSS, and ReactJS, along with external JavaScript libraries for implementing supporting functionalities. It will consume the REST API implemented in the backend to fetch the data from the database and then display it pictorially using ChartJS.

- Back End: The back-end portion of the application will be written in ExpressJS running on Node.js. It will be an API server that fetches data from the database tables and returns it to the front-end in JSON format. All queries to the database will be handled by the backend.

- Database: We will need a SQL database to store and query our data. Since we need to perform complex queries like GROUP BY and AGGREGATE, we will prefer to use a SQL database like MySQL. It will act as the reporting database for our application.

### Proposed Tech Stack

- Front End: HTML, CSS, ReactJS with other JavaScript libraries
- Back End: ExpressJS server running on Node.js in a Linux environment
- Database: MySQL

## Conclustion

The primary objective of the portal is to provide a data visualisation portal to the beneficiaries of the Import/Export data. It is intended to be a one-stop solution so that stakeholders can access ongoing trends in the data in a clean and concise manner, while gaining insights that are useful to them.
