import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';


dotenv.config();
const port = process.env.PORT || 3001;
const app = express();
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Database connection successful');
})
.catch((error) => {
    console.log(error);
});

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is connected at port: ${port}`)
});