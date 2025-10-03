    import express from 'express'
    import cors from 'cors'
    import cookieParser from 'cookie-parser';
    import userRouter from './routes/user.routes.js';
    import staffRouter from './routes/staff.complaint.route.js';
    import complaintRouter from './routes/complaint.routes.js'

    const app = express();

    app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }))

    app.use(express.json({limit:"16kb"}));

    app.use(express.urlencoded({
        extended:true,
        limit:"16kb"
    }))

    app.use(express.static("public"))

    app.use(cookieParser())

    //routes import


    //routes declaration
    app.use("/api/v1/", userRouter) //middleware use kr rhe get nhi krr rhe kyunki ab hum router use kr rhe hain jo
    app.use("/api/v1/staff/complaints", staffRouter);
    app.use("/api/v1/complaint/", complaintRouter);
    


//admin routes
app.use("/api/v1/admin/", adminRouter)

export {app};