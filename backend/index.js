const express = require("express");
const app = express();
const {dbConnect} = require("./cofig/database")
const {cloudinaryConnect} = require("./cofig/cloudinary")
const EasySignRoutes = require("./routes/EasySign")
const cookieParser = require("cookie-parser");
const cors = require("cors");


require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // if you're using cookies / auth
}));


dbConnect();
cloudinaryConnect();

//Mounting routes
app.use("/api/v1/easysign", EasySignRoutes);

app.listen(PORT,()=>{
    console.log(`App is Running at Port ${PORT}`);
})