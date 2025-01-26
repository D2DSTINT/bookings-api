// server.js
import express from "express";
import mongoose from "mongoose";
import Booking from "./models/booking.js"; // Import the Booking model
import bodyParser from "body-parser";
import cors from "cors";
import corsOptions from "./cors.config.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(bodyParser.json());
app.options("*", cors(corsOptions));

let isConnected = false; // Track the connection state

async function connectToDatabase() {
    if (!isConnected) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            isConnected = true;
            console.log("MongoDB connected");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw error; // Rethrow the error to handle it upstream
        }
    }
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
    try {
        await connectToDatabase();

        const { name, email, contact, address, services, timing, date } =
            req.body;

        // Create a new booking
        const newBooking = new Booking({
            name,
            email,
            contact,
            address,
            services,
            timing,
            date,
        });

        // Save booking to MongoDB
        const savedBooking = await newBooking.save();

        res.status(201).json({
            message: "Booking saved successfully",
        });
    } catch (error) {
        console.error("Error saving booking:", error);
        res.status(500).json({
            message: "Failed to save booking",
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
