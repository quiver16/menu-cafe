import mongoose, { Schema } from "mongoose";

interface ICategory {
    Codp: string;
    Descripcion: string;
    Info: string;
    Descuento: number;
    Cocina: string;
    Image: string;
    ImageFs: string;
    CreatedBy: Date;
    UpdatedBy: Date;
    CreatedAt: Date;
}

const categorySchema = new Schema({
    Codp: {
        type: String,
        required: true,
        unique: true
    },
    Descripcion: {
        type: String,
        required: true,
        unique: true
    },
    Info: {
        type: String,
        required: true,
        unique: true
    },
    Descuento: {
        type: Number,
        required: true,
        unique: true
    },
    Cocina: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cocinas",
        required: true,
        unique: true
    },
    Image: {
        type: String,
        required: true,
        unique: true
    },
    ImageFs: {
        type: String,
        required: true,
        unique: true
    },
    CreatedBy: {
        type: Date,
        required: true,
    },
    UpdatedBy: {
        type: Date,
        required: true,
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


const Categoria = mongoose.model<ICategory>("Categoria", categorySchema);

export default Categoria;