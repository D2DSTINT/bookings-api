import dotenv from "dotenv";
dotenv.config();

const allowedOrigins =
    process.env.NODE_ENV === "production"
        ? [process.env.ORIGIN_URL]
        : [
              `http://localhost:${process.env.PORT}`,
              `http://127.0.0.1:${process.env.PORT}`,
          ];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin only if in development
        if (!origin && process.env.NODE_ENV !== "production") {
            return callback(null, true);
        }

        // Check if the origin is in the allowed list
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS Error: Origin not allowed"));
        }
    },
};

export default corsOptions;
