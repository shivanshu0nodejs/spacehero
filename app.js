const express = require('express');
require("dotenv").config();
const app = express();
const connectDB = require("./db/connect.js");
const routes = require("./routes/route.js");
const cors = require('cors');

const PORT = process.env.PORT || 3600;

app.use(express.json());
app.use(cors());

app.use("/", routes);

app.use('/uploads/documents', express.static('uploads/documents'));
app.use('/uploads/profileImage', express.static('uploads/profileImage'));

const start = async() => {
    try {
        await connectDB(process.env.MONGODB_URI);
        app.listen(PORT, () => {
            console.log(`Connected To PORT ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
