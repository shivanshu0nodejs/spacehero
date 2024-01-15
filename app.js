const express = require('express');
require("dotenv").config();
const app = express();
const connectDB = require("./db/connect.js");
const routes = require("./routes/route.js");

const PORT = process.env.PORT || 3600;

app.use(express.json());

app.use("/", routes);

const start = async() => {

    try{

        await connectDB(process.env.MONGODB_URI);
        app.listen(PORT, () => {
            console.log(`Connected To PORT ${PORT}`);
        });

    }catch (error){
        console.log(error);
    }
};

start();