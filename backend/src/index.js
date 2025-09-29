
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is listening at port ${process.env.PORT}`);
    })
    app.on("error", (error)=>{
        console.log("app listening error", error);
        throw error
    })
})
.catch((err)=>{
    console.log("DB connection error", err);
})
