import dotenv from 'dotenv';

// This line loads the environment variables from the .env file in your project's root directory
dotenv.config({
    path: '../.env'
})
console.log("Connecting to:", process.env.MONGODB_URI);

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../src/models/user.model.js';
import connectDB from '../src/db/index.js'; //db connection function
import { ROLES } from '../src/enum/roles.js';

const seedAdmin = async () => {
    try {
        await connectDB();

        // if an admin user already exists
        const adminExists = await User.findOne({ role: ROLES.ADMIN });

        if (adminExists) {
            console.log('Admin user already exists. Seeding not required.');
            return;
        }

        // hash the password from an environment variable for security

        await User.create({
            fullName: 'First Admin',
            email: 'admin@gmail.com',
            password: process.env.ADMIN_PASSWORD,
            role: ROLES.ADMIN,
            address:{
                locality:"mnnit",
                city:"prayagraj",
                district:"prayagraj",
                pinCode:"211004",
                state:"uttar pradesh"
            },
            profilePicture:"https://res.cloudinary.com/complainttrackingsystem/image/upload/v1759994824/avatar_2_palrfq.jpg"
        });


        // console.log('✅ Default admin user created successfully!');

    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedAdmin();