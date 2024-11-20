<H1 style="text-align: center;"> CS6.302: Software Systems Development </H1>
<H3 style="text-align: center;"> Backend Component </H3>

## Description

This directory contains the backend server that will interact will the database and return the `import/export` data to the `React.Js` frontend based on the applied filters. There is a single endpoint that is exposed via a `GET` HTTP request.

## Endpoints
1. User Management Endpoints:
    - `/user/check`: Check if the user making the request is logged in or not via a GET request
    - `/user/register`: Register a new user via a POST request.
    - `/user/login`: Login a user by validating credentials sent via a POST request
    - `/user/logout`: Logout a user via a GET request

2. Data Endpoint:
    - `/data/<category>/<import/export>/<year/geography>?<filters>`: The templated parameters in the endpoint URL indicate the parameters that can be passed to the API to filter the data.  
    
        The `year/geography` path param at the end indicates if the data should be returned by `year` or by `geography` i.e. by continent. Currently returning both data is not possible in a single API call - multiple calls need to be made.

        The following filters are currently supported, when passed in the URL:
        - `years`: the particular years (in the format `20xx_yy`) for which the data should be returned
        - `geographies`: the continents (in usual English, like `North America`) for which the data should be returned
        - `commodities`: the commodities for which data should be returned

## Response
The response is a JSON object of the format:
```
{
    "message": "",
    "status": <int>,
    "data": {}
}
```

If the status code is `200`, the data object contains data in the format:
```
"data": {
    "labels": [],
    "commodity_data": [
        {
            "name": "Commodity 1",
            "value": [<price values mapped one-to-one with label indices>],
            "quantity": [<quantity values mapped one-to-one with label indices>]
        },
        {
            "name": "Commodity 2",
            "value": [],
            "quantity": []
        },
        ...
    ]
}
```

Otherwise, the data is an empty object and the `message` field indicates the error that occurred.

## How To Execute:

1. Ensure that the MySQL service is running and the instructions [in the database section](/database/README.md) have been followed. The backend expects that the tables are already loaded by the scripts and are ready for querying.

2. Add the configuration params in the `conf.env` file.

3. From the `backend` directory, run `npm install` to install the necessary dependencies.

4. Run `npm start` or `node app.js` to start the backend server on the port specified in the `conf.env` file (defaults to `5000`)
