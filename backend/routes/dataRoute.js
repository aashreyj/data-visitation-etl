import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';

dotenv.config({ path: './conf.env' });

import {
    allCategories, allCommodities, allGeographies, allYears,
    HTTP_STATUS_OK, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_SERVER_ERROR
} from '../constants.js';

const router = express.Router();
const dbConfig = {
    host: process.env.DATABASE_CONNECTION_HOST,
    user: process.env.DATABASE_CONNECTION_USERNAME,
    password: process.env.DATABASE_CONNECTION_PASSWORD
}

const continentsCTE = "WITH Continents AS (SELECT 'Africa' AS Continent UNION ALL SELECT 'Asia' UNION ALL SELECT 'Europe' UNION ALL SELECT 'North America' UNION ALL SELECT 'Oceania' UNION ALL SELECT 'South America') "
const yearsCTE = "WITH Years AS (SELECT '2014_15' AS Year UNION ALL SELECT '2015_16' UNION ALL SELECT '2016_17' UNION ALL SELECT '2017_18' UNION ALL SELECT '2018_19' UNION ALL SELECT '2019_20' UNION ALL SELECT '2021_22' UNION ALL SELECT '2022_23') "

// FUNCTION TO CONVERT A WORD TO TITLE CASE
function toTitleCase(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// ENDPOINT TO RETRIVE DATA BASED ON THE FILTERS APPLIED IN THE QUERY
router.get('/:category/:ieType/:ygType', async (req, res) => {

    // EXTRACT ALL QUERY PARAMS or SET DEFAULT VALUES
    let years = req.query.years;
    if (!years)
        years = allYears;

    let geographies = req.query.regions;
    if (!geographies)
        geographies = allGeographies;
    if (!Array.isArray(geographies))
        geographies = Array(geographies);

    let commodities = req.query.commodities;
    if (!commodities)
        commodities = allCommodities;
    if (!Array.isArray(commodities))
        commodities = Array(commodities);

    // EXTRACT ALL PATH PARAMS
    const category = req.params.category.toLowerCase();
    const importOrExport = req.params.ieType.toLowerCase();
    let yearOrGeography = req.params.ygType.toLowerCase();

    // VALIDATIONS
    if (!allCategories.includes(category)) {
        console.error("Invalid category selected");
        return res
            .status(HTTP_STATUS_BAD_REQUEST)
            .json({ message: "Invalid category selected", status: HTTP_STATUS_BAD_REQUEST, data: {} });
    }
    if (importOrExport != "import" && importOrExport != "export") {
        console.error(`Invalid data type: ${importOrExport}`);
        return res
            .status(HTTP_STATUS_BAD_REQUEST)
            .json({ message: "Invalid data type", status: HTTP_STATUS_BAD_REQUEST, data: {} });
    }
    if (yearOrGeography === "year")
        yearOrGeography = "Year";
    else if (yearOrGeography === "geography")
        yearOrGeography = "Geography";
    else {
        console.error("Invalid path param for year/geography");
        return res
            .status(HTTP_STATUS_BAD_REQUEST)
            .json({ message: "Invalid path param for year/geography", status: HTTP_STATUS_BAD_REQUEST, data: {} });
    }

    // CREATE CONNECTION TO DATABASE
    dbConfig.database = importOrExport + "_data_" + category;
    const connection = mysql.createConnection(dbConfig);

    try {
        connection.connect();
        console.log(`\nSuccessfully connected to local MySQL Server: ${dbConfig.database} database`);
    }
    catch (err) {
        console.error(err.message);
        return res
            .status(HTTP_STATUS_SERVER_ERROR)
            .json({ message: "Internal error occurred", status: HTTP_STATUS_SERVER_ERROR, data: {} });
    }

    // DATA AGGREGATION
    const data = {};
    data.commodity_data = [];
    if (yearOrGeography === "Year")
        data.labels = [...years].sort();
    else
        data.labels = [...geographies]
            .map(geo => geo.split(' ').map(word => toTitleCase(word)).join(' '))
            .sort();


    for (const commodity of commodities) {
        const dataset = {};
        dataset.name = toTitleCase(commodity);
        dataset.quantity = [];
        dataset.value = [];

        const yearsString = JSON.stringify(years).replace('[', '(').replace(']', ')');
        const geographiesString = JSON.stringify(geographies).replace('[', '(').replace(']', ')');

        let query = "";

        if (yearOrGeography === "Year") {
            query += yearsCTE + "SELECT y.Year, COALESCE(SUM(d.Value), 0) AS VAL, COALESCE(SUM(d.Quantity), 0) AS QUAN FROM Years as y LEFT JOIN ";
            query += importOrExport + "_data_" + commodity.toLowerCase() + " d ON y.Year = d.Year AND d.Year IN " + yearsString + " AND d.Continent IN " + geographiesString + " GROUP BY ";
            query += "y.Year ORDER BY y.Year";
        }
        else {
            query += continentsCTE + "SELECT c.Continent, COALESCE(SUM(d.Value), 0) AS VAL, COALESCE(SUM(d.Quantity), 0) AS QUAN FROM Continents as c LEFT JOIN ";
            query += importOrExport + "_data_" + commodity.toLowerCase() + " d ON c.Continent = d.Continent AND d.Year IN " + yearsString + " AND d.Continent IN " + geographiesString + " GROUP BY ";
            query += "c.Continent ORDER BY c.Continent";
        }

        // RUN THE SQL QUERY ASYNCHRONOUSLY AND WAIT FOR RESPONSE
        await new Promise((resolve) => {
            connection.query(query, function (err, queryResult) {
                if (err) {
                    console.error(err.message);
                    return res
                        .status(HTTP_STATUS_SERVER_ERROR)
                        .json({ message: "MySQL error occurred", status: HTTP_STATUS_SERVER_ERROR, data: {} });
                }

                // COLLECT DATA IN THE OBJECT
                queryResult.forEach(row => {
                    if (data.labels.includes(row.Year) || data.labels.includes(row.Continent)) {
                        dataset.quantity.push(row.QUAN);
                        dataset.value.push(row.VAL);
                    }
                });
                resolve();
            });
        });
        data.commodity_data.push(dataset);
    }

    // CLOSE CONNECTION AND RETURN RESPONSE
    connection.end();
    console.log(`Response data: ${JSON.stringify(data)}`);
    return res
        .status(HTTP_STATUS_OK)
        .json({ message: "Success", status: HTTP_STATUS_OK, data: data });
})

// ENDPOINT TO RETRIVE DATA BASED ON THE FILTERS APPLIED IN THE QUERY
router.get('/plot/:category/:ieType/commodity', async (req, res) => {

    // EXTRACT ALL QUERY PARAMS or SET DEFAULT VALUES
    let years = req.query.years;
    if (!years)
        years = allYears;

    let geographies = req.query.regions;
    if (!geographies)
        geographies = allGeographies;
    if (!Array.isArray(geographies))
        geographies = Array(geographies);

    let commodity = req.query.commodities;

    // EXTRACT ALL PATH PARAMS
    const category = req.params.category.toLowerCase();
    const importOrExport = req.params.ieType.toLowerCase();

    // VALIDATIONS
    if (!allCategories.includes(category)) {
        console.error("Invalid category selected");
        return res
            .status(HTTP_STATUS_BAD_REQUEST)
            .json({ message: "Invalid category selected", status: HTTP_STATUS_BAD_REQUEST, data: {} });
    }
    if (importOrExport != "import" && importOrExport != "export") {
        console.error(`Invalid data type: ${importOrExport}`);
        return res
            .status(HTTP_STATUS_BAD_REQUEST)
            .json({ message: "Invalid data type", status: HTTP_STATUS_BAD_REQUEST, data: {} });
    }

    // CREATE CONNECTION TO DATABASE
    dbConfig.database = importOrExport + "_data_" + category;
    const connection = mysql.createConnection(dbConfig);

    try {
        connection.connect();
        console.log(`\nSuccessfully connected to local MySQL Server: ${dbConfig.database} database`);
    }
    catch (err) {
        console.error(err.message);
        return res
            .status(HTTP_STATUS_SERVER_ERROR)
            .json({ message: "Internal error occurred", status: HTTP_STATUS_SERVER_ERROR, data: {} });
    }

    // DATA AGGREGATION
    const data = {};
    data.commodity_data = {};
    data.labels = [...years].sort();
    for (let geo of geographies) {
        data.commodity_data[geo] = {
            value: [],
            quantity: []
        };
        let dataset = {};
        dataset.name = geo;
        dataset.value = [];
        dataset.quantity = [];
    }

    const yearsString = JSON.stringify(years).replace('[', '(').replace(']', ')');
    const geographiesString = JSON.stringify(geographies).replace('[', '(').replace(']', ')');

    let query = "WITH Years AS (SELECT '2014_15' AS Year UNION ALL SELECT '2015_16' UNION ALL SELECT '2016_17' UNION ALL SELECT '2017_18' UNION ALL SELECT '2018_19'";
    query += " UNION ALL SELECT '2019_20' UNION ALL SELECT '2021_22' UNION ALL SELECT '2022_23'), Continents AS (SELECT 'Africa' AS Continent UNION ALL SELECT 'Asia'";
    query += "UNION ALL SELECT 'Europe' UNION ALL SELECT 'North America' UNION ALL SELECT 'Oceania' UNION ALL SELECT 'South America') SELECT y.Year, c.Continent,";
    query += " COALESCE(SUM(d.Value), 0) AS VAL, COALESCE(SUM(d.Quantity), 0) AS QUAN FROM Years y CROSS JOIN Continents c LEFT JOIN ";
    query += importOrExport + "_data_" + commodity.toLowerCase() + " d ON y.Year = d.Year AND c.Continent = d.Continent WHERE (d.Year IN " + yearsString;
    query += " OR d.Year IS NULL) AND (d.Continent IN " + geographiesString + " OR d.Continent IS NULL) GROUP BY c.Continent, y.Year ORDER BY c.Continent, y.Year;";


    // RUN THE SQL QUERY ASYNCHRONOUSLY AND WAIT FOR RESPONSE
    await new Promise((resolve) => {
        connection.query(query, function (err, queryResult) {
            if (err) {
                console.error(err.message);
                return res
                    .status(HTTP_STATUS_SERVER_ERROR)
                    .json({ message: "MySQL error occurred", status: HTTP_STATUS_SERVER_ERROR, data: {} });
            }

            // COLLECT DATA IN THE OBJECT
            queryResult.forEach(row => {
                if (data.labels.includes(row.Year) || data.labels.includes(row.Continent)) {
                    data.commodity_data[row.Continent].value.push(row.VAL);
                    data.commodity_data[row.Continent].quantity.push(row.VAL);
                }
            });
            resolve();
        });
    });

    // CLOSE CONNECTION AND RETURN RESPONSE
    connection.end();
    console.log(`Response data: ${JSON.stringify(data)}`);
    return res
        .status(HTTP_STATUS_OK)
        .json({ message: "Success", status: HTTP_STATUS_OK, data: data });
})

export default router;
