// server.js
import express from "express";
import mongoose from "mongoose";
import Booking from "./models/booking.js"; // Import the Booking model
import dashboardMetric from "./models/dashboard.metric.js";
import bodyParser from "body-parser";
import cors from "cors";
import corsOptions from "./cors.config.js";
import dotenv from "dotenv";
import crypto from "node:crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(bodyParser.json());
app.options("*", cors(corsOptions));

let isConnected = false; // Track the connection state
let dbConnectionPromise = null;

const mongooseOptions = {
    maxPoolSize: 10,
    minPoolSize: 5,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
};

async function connectToDatabase() {
    if (dbConnectionPromise) return dbConnectionPromise;

    if (!isConnected) {
        dbConnectionPromise = mongoose
            .connect(process.env.MONGO_URI, mongooseOptions)
            .then(() => {
                isConnected = true;
                console.log("MongoDB connected");
            })
            .catch((error) => {
                console.error("Error connecting to MongoDB:", error);
                dbConnectionPromise = null;
                throw error;
            });
    }
    return dbConnectionPromise;
}

app.get("/", (req, res) => {
    res.redirect(308, "/api/healthcheck");
});

app.get("/api/healthcheck", (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: "Server is running",
    };
    res.status(200).json(healthcheck);
});

// Route to save booking data
app.post("/api/booking", cors(corsOptions), async (req, res) => {
    const { service, customer, date, time, address, status } = req.body;
    const id = crypto.randomBytes(3).toString("hex").toUpperCase();

    // Return immediately with booking ID
    res.status(202).json({
        message: "Booking request received",
        bookingId: id,
        status: "Processing",
    });

    // Process in background
    try {
        await connectToDatabase();

        const newBooking = new Booking({
            id,
            service,
            customer: {
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
            },
            date,
            time,
            address: {
                fullAddress: address.fullAddress,
                houseNumber: address.houseNumber,
                landmark: address.landmark || "N/A",
                pincode: address.pincode || "N/A",
            },
            status: status || "Pending",
        });

        await newBooking.save();
        await dashboardMetric.findOneAndUpdate(
            {},
            { $inc: { totalBookings: 1, pendingBookings: 1 } },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error("Error processing booking:", error);
        // Consider implementing a retry mechanism or error queue
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
