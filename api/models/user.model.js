import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://photosnow.net/wp-content/uploads/2023/12/no-dp38.jpg"
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;