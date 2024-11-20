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

// FUNCTION TO CONVERT A WORD TO TITLE CASE
function toTitleCase(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// ENDPOINT TO RETRIVE DATA BASED ON THE FILTERS APPLIED IN THE JSON REQUEST BODY
router.get('/:category/:ieType/:ygType', async (req, res) => {

    // EXTRACT ALL QUERY PARAMS or SET DEFAULT VALUES
    let years = req.query.years;
    if (!years)
        years = allYears;
    else
        years = years.split(",");

    let geographies = req.query.geographies;
    if (!geographies)
        geographies = allGeographies;
    else
        geographies = geographies.split(",");

    let commodities = req.query.commodities;
    if (!commodities)
        commodities = allCommodities;
    else
        commodities = commodities.split(",");

    // EXTRACT ALL PATH PARAMS
    const category = req.params.category.toLowerCase();
    const importOrExport = req.params.ieType.toLowerCase();
    let yearOrGeography = req.params.ygType.toLowerCase();

    // VALIDATIONS
    if (!allCategories.includes(category))
        return res
            .status(HTTP_STATUS_BAD_REQUEST)
            .json({ message: "Invalid category selected", status: HTTP_STATUS_BAD_REQUEST, data: {} });

    if (importOrExport != "import" && importOrExport != "export")
        return res
            .status(HTTP_STATUS_BAD_REQUEST)
            .json({ message: "Invalid data type", status: HTTP_STATUS_BAD_REQUEST, data: {} });

    if (yearOrGeography === "year")
        yearOrGeography = "Year";
    else if (yearOrGeography === "geography")
        yearOrGeography = "Geography";
    else
        return res
            .status(HTTP_STATUS_BAD_REQUEST)
            .json({ message: "Invalid path param for year/geography", status: HTTP_STATUS_BAD_REQUEST, data: {} });


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
        data.labels = [...years].sort()
    else
        data.labels = [...geographies].sort()

    for (const commodity of commodities) {
        const dataset = {};
        dataset.name = toTitleCase(commodity);
        dataset.quantity = [];
        dataset.value = [];

        const yearsString = JSON.stringify(years).replace('[', '(').replace(']', ')');
        const geographiesString = JSON.stringify(geographies).replace('[', '(').replace(']', ')');

        let query = "SELECT SUM(Value) as VAL, SUM(Quantity) as QUAN FROM " + importOrExport + "_data_" + commodity.toLowerCase() + " WHERE Year IN " + yearsString;

        // TODO: Remove #109 and uncomment #108 once Continent column is added to the database
        // query += " AND Continent IN " + geographiesString + " GROUP BY ";
        query += " GROUP BY ";

        if (yearOrGeography === "Year")
            query += "Year ORDER BY Year";
        else
            query += "Continent ORDER BY Continent";

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
                    dataset.quantity.push(row.QUAN);
                    dataset.value.push(row.VAL);
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

export default router;
