const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = () =>{
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("DB Connected Successfully!!!");
    })
    .catch((error) =>{
        console.error(error);
        console.log("Error while connecting to DB");
        process.exit(1);
    })
}