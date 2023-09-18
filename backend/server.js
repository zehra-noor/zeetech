//path
import path from "path";

import express from "express";
const app = express();

//cookie parser
import cookieParser from "cookie-parser";

// .env setup
import dotenv from "dotenv";
dotenv.config();

// port
const port = process.env.PORT || 5000;

//cors
import cors from "cors";
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

//middleware
import { notFound, errorHandler } from "./middleware/errorHandler.js";

//routes
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

//mongoDB conection
import connectDB from "./config/db.js";
connectDB();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser middleware
app.use(cookieParser());

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  //uploads
  app.use("/uploads", express.static("/var/data/uploads"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  const __dirname = path.resolve();
  app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

//routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

//middleware
app.use(notFound);
app.use(errorHandler);

// server listening to port
app.listen(port, () => console.log(`listening on the port: ${port}`));
