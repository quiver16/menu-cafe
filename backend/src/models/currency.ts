import { Schema, model } from "mongoose";

const currencySchema = new Schema({
    Codp: { type: String, required: true },
    Factor: { type: Number, required: true },
    Symbol: { type: String, required: true },
    
});

export default model("monedas", currencySchema);