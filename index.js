// server.js
import express from "express";
import mongoose from "mongoose";
import Booking from "./models/booking.js"; // Import the Booking model
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// Route to save booking data
app.post("/api/bookings", async (req, res) => {
    try {
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
            // booking: savedBooking
        });
    } catch (error) {
        console.error("Error saving booking:", error);
        res.status(500).json({
            message: "Failed to save booking",
            error: error.message,
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
