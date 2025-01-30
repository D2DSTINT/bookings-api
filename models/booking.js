// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        id: {
            // Correct field name
            type: String,
            required: [true, "Booking ID is required"],
            unique: true,
        },
        service: {
            type: String,
            required: true,
        },
        customer: {
            name: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        address: {
            fullAddress: { type: String, required: true },
            houseNumber: { type: String, required: true },
            landmark: { type: String, default: "N/A" },
            pincode: { type: String, default: "N/A" },
        },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
