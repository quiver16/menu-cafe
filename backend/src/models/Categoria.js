var mongoose = require("mongoose");
const { objectOf } = require("prop-types");
var Schema = mongoose.Schema;

//Make a login schema
const CategoriaSchema = new Schema(
  {
    Codp: { type: String, required: true },
    Descripcion: { type: String, required: true },
    Info: { type: String, required: false },
    Descuento: { type: Number, required: false, default: 0 },
    Cocina: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cocinas",
      required: false,
    },
    CreatedAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
    CreatedBy: { type: String, required: false },
    Image: {
      type: String,
      required: false,
      default: "",
    },
    ImageFs: { data: Buffer, contentType: String },
  },
  {
    timestamps: true,
  }
);

module.exports = CategoriaSchema;

//module.exports = mongoose.model('Departaments', DepartamentsSchema);
