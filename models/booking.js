// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: false },
    contact: { type: String, required: true },
    address: {
        fullAddress: { type: String, required: true },
        houseNumber: { type: String, required: true },
        landmark: { type: String, default: "N/A" },
        pincode: { type: String, default: "N/A" },
    },
    services: { type: String, required: true },
    timing: { type: String, required: true },
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);
