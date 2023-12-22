const express = require("express");
const connectDB=require("./config/dbConnect")
const path=require("path")
const dotenv=require("dotenv").config()
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const port=process.env.PORT||5000;
const app=express()
connectDB()
// used to parse the data which server recieves from the client
// inbuilt middleware for parsing json objects
app.use(express.json())
app.use(cookieParser());
app.use(logger('dev'));

const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors());

// app.use(express.static("./build"))
// app.get("*",(req,res)=>{
    //     res.sendFile(path.resolve(__dirname,"build","index.html"))
    // })
app.use("/api/daily-income-expense",require("./routes/dailyIncomeExpenseRoutes"));
app.use("/api/users",require("./routes/userRoutes"));
app.use(errorHandler)


app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})