const express = require("express");
const mongoose=require("mongoose");
const cors = require('cors');

const app = express();

app.get('/',(req,res)=>{
res.json({message: "the backend is running"})
});

app.listen(process.env.PORT || 5000,() => {
 console.log("server running on  port")
})

.catch((error) =>{
console.log("not ok")
})