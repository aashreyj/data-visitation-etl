import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';
import passport from 'passport';
import passportLocal from 'passport-local';

dotenv.config({ path: './conf.env' });

import { HTTP_STATUS_OK, HTTP_STATUS_CREATED, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_SERVER_ERROR, HTTP_STATUS_UNAUTHORISED } from '../constants.js';

const router = express.Router();
const localStrategy = passportLocal.Strategy;

const dbConfig = {
    host: process.env.DATABASE_CONNECTION_HOST,
    user: process.env.DATABASE_CONNECTION_USERNAME,
    password: process.env.DATABASE_CONNECTION_PASSWORD,
    database: process.env.DATABASE_DEFAULT
};

const pool = mysql.createPool(dbConfig);
const db = pool.promise();

// CONNECT TO THE DB AND CREATE THE USER TABLE IF IT DOES NOT EXIST
const initialQuery = "CREATE TABLE IF NOT EXISTS User (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, username VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL)";
try {
    await db.query(initialQuery);
}
catch (err) {
    console.log(`User table creation failed: ${err.message}`);
}

// SERIALIZE AND DESERIALIZE THE USER
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await db.query('SELECT * FROM User WHERE id = ?', [id]);
        if (rows.length > 0) {
            done(null, rows[0]);
        } else {
            done(null, false);
        }
    } catch (error) {
        done(error, null);
    }
});

// CONFIGURE LOCAL STRATEGY
passport.use(
    new localStrategy(async (username, password, done) => {
        try {
            const [rows] = await db.query("SELECT * FROM User WHERE username = ?", [username]);
            if (rows.length === 0) return done(null, false, { message: "Incorrect username", status: HTTP_STATUS_BAD_REQUEST });

            const user = rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: "Incorrect password", status: HTTP_STATUS_UNAUTHORISED });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

// ENDPOINT TO CHECK IF THE USER IS LOGGED IN OR NOT
router.get('/check', async (req, res) => {
    if (req.isAuthenticated()) {
        delete req.user.password;
        res
            .status(HTTP_STATUS_OK)
            .json({ loggedIn: true, user: req.user });
    } else {
        res
            .status(HTTP_STATUS_OK)
            .json({ loggedIn: false });
    }
});

// ENDPOINT TO CREATE A NEW USER
router.post('/register', async (req, res) => {
    const { first_name, last_name, username, password } = req.body;

    if (!first_name || !last_name || !username || !password)
        return res
            .status(HTTP_STATUS_BAD_REQUEST)
            .json({ message: "Missing fields in the request", status: HTTP_STATUS_BAD_REQUEST });

    try {
        const [existingUser] = await db.query("SELECT * FROM User WHERE username = ?", [username]);
        if (existingUser.length > 0) {
            return res
                .status(HTTP_STATUS_BAD_REQUEST)
                .json({ message: "Username is taken", status: HTTP_STATUS_BAD_REQUEST });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO User (first_name, last_name, username, password) VALUES (?, ?, ?, ?)", [first_name, last_name, username, hashedPassword]);

        return res
            .status(HTTP_STATUS_CREATED)
            .json({ message: "User registered successfully", status: HTTP_STATUS_CREATED });
    } catch (error) {
        console.error(error);
        res
            .status(HTTP_STATUS_SERVER_ERROR)
            .json({ message: "Internal Server error", status: HTTP_STATUS_SERVER_ERROR });
    }
});

// ENDPOINT TO LOGIN A USER
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            console.error(err.message);
            return res
                .status(HTTP_STATUS_SERVER_ERROR)
                .json({ message: "Internal Server Error", status: HTTP_STATUS_SERVER_ERROR });
        }

        if (!user) {
            return res
                .status(HTTP_STATUS_UNAUTHORISED)
                .json({ message: "Invalid username or password", status: HTTP_STATUS_UNAUTHORISED })
        }

        req.logIn(user, (err) => {
            if (err) {
                return res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Login failed", status: HTTP_STATUS_SERVER_ERROR });
            }

            delete req.user.password;
            return res.status(HTTP_STATUS_OK).json({
                message: "Logged in successfully",
                user: req.user
            });
        });
    })(req, res, next);
});

// ENDPOINT TO LOGOUT A USER
router.post('/logout', async (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Error during logging out", status: HTTP_STATUS_SERVER_ERROR });
        }
        res.status(HTTP_STATUS_OK).json({ message: "Logged out successfully", status: HTTP_STATUS_OK });
    });
});

export default router;
