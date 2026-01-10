import mongoose, { Schema } from "mongoose";

export interface IProduct {
    name: string;
    price: number;
    categoryCode: string;
    imageBase64?: string;
    description?: string;
    isAvailable: boolean;
}

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    categoryCode: {
        type: String,
        required: true
    },
    imageBase64: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    isAvailable: {
        type: Boolean,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema)

export default Product
