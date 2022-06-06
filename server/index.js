import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/user.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(
    bodyParser.json({
        limit: "30mb",
        extended: true,
    })
); // ? limits whatever's sent to 30mb, because we dont want 1tb images uploaded
app.use(
    bodyParser.urlencoded({
        limit: "30mb",
        extended: true,
    })
);
app.use(cors());

app.use("/posts", postRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
    res.send("app is running!?");
});

// const CONNECTION_URL =
//     "mongodb+srv://ericyakubu:Kislotius1@cluster0.3lm1e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.REACT_APP_PORT || 5000;

mongoose
    .connect(process.env.REACT_APP_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() =>
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    )
    .catch((error) => console.log(error.message));
