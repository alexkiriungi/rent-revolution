import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';


dotenv.config();
const port = process.env.PORT || 3001;
const app = express();
app.use(cookieParser());
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Database connection successful');
})
.catch((error) => {
    console.log(error);
});

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);



app.listen(port, () => {
    console.log(`Server is connected at port: ${port}`)
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});