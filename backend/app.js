import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import session from 'express-session';

import dataRoute from './routes/dataRoute.js';
import userRoute from './routes/userRoute.js';
import { HTTP_STATUS_UNAUTHORISED } from './constants.js';

const app = express();
dotenv.config({ path: './conf.env' });
const port = process.env.APPLICATION_PORT || 5000;
const sessionSecret = process.env.SECRET;
const corsOptions = {
    origin: "*",
    credentials: true,
    optinoSuccessState: 200,
}

function isAuthenticated(req, res, next) {
    const unauthRoutes = ["/user/register", "/user/login"]
    if(unauthRoutes.includes(req.path) || req.isAuthenticated())
        return next();
    return res.status(HTTP_STATUS_UNAUTHORISED).json({message: "User is not logged in", status: HTTP_STATUS_UNAUTHORISED});
}

// MIDDLEWARE
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(isAuthenticated);

// ROUTERS
app.use('/user', userRoute);
app.use('/data', dataRoute);

// START SERVER
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
});
