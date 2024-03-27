const express = require("express");
const connection = require("./db");
const userRouter = require("./routes/user.route");
const axios = require('axios');
const authenticate = require("./middlewares/authenticate.middleware");
require("dotenv").config();

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Pioneer_Assessment");
});


// API endpoints to fetch data
app.get('/api/data', async(req, res) => {
    const { category, limit} = req.query;
    const response=await axios.get(`https://api.publicapis.org/entries`);
    let data=response.data.entries;
    if(!data){
        res.status(201).send({"message":'404 Not found'})
    }
    if(category){
        data=data.filter(el=>el.Category.toLowerCase()===category.toLowerCase());
    }
    if(limit){
        data=data.slice(0, limit);
    }
    res.status(200).send(data);
});


// New API endpoint with JWT authentication
app.get('/secure-endpoint', authenticate, (req, res) => {
    res.json({ message: "This is a secure endpoint. Only authenticated users can access it." });
});


// userRouter and authenticate middleware
app.use("/", userRouter);
app.use(authenticate);

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("Connected to DB");
    } catch (error) {
        console.log(error);
    }
    console.log("Server is running on port 3500");
});
