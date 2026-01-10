import mongoose, { Schema } from "mongoose";

interface ICategory {
    id: string;
    Name: string;
    Descripcion: string;
    CreatedAt: Date;
    UpdatedAt: Date;
}

const categorySchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    Name: {
        type: String,
        required: true,
        unique: true
    },
    Descripcion: {
        type: String,
        required: true,
        unique: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    UpdatedAt: {
        type: Date,
        default: Date.now
    }
});


const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;