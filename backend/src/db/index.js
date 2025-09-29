import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

// console.log(process.env.MONGODB_URI);
const connectDB = async () => {
    try {
        //mongoose hume ek object return krta hai jise connection instance me store kiya hai
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n mongodb connected !! DB HOST : ${connectionInstance.connection.host}` )
    } catch (error) {
        console.log("mongo db error", error);
        process.exit(1);
    }
}

export default connectDB