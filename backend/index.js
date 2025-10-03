const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8080
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');



// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://assignment-delta-tawny.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials:true
}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).json({ message:"Hello World!" })
})

//routes
app.use('/api', authRoutes);
app.use('/api', assignmentRoutes);

// function to connect DB
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            family:4,
        });
        console.log("MongoDB connected");
    }catch(error){
        console.log("MongoDB connection failed",{ 
            name:error.name,
            message:error.message,
            code:error.code,
        });
        process.exit(1);
    }
}


// start server only when DB is connected
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log('Error starting server:', error);
        process.exit(1);
    }
};

startServer(); 