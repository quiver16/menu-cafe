//Make a schelma for the table ProductosGeneral
var mongoose = require("mongoose");
const { objectOf } = require("prop-types");
var Schema = mongoose.Schema;
var ProductosGeneralSchema = new Schema(
  {
    //OJO MODIFICAR VALIDACIONES Edit 29/09/2022 Fino revisar Types.ts
    // MODIFICACIONES 0.9.10 01/30/25 MermaPorc, Receta
    Codp: { type: String, required: true, index: { unique: true } },
    Descrip: { type: String, required: true },
    DescripCorta: { type: String, default: "" },
    Ref: { type: String },
    Unidad: { type: String },
    lineap: { type: String },
    Departa: { type: String },
    Categoria: { type: String },
    SubCategoria: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategorias",
        required: false,
      },
    ],
    PrincipioActivo: { type: String },
    UpcAlternos: [{ type: String }],
    Marca: { type: String },
    Divisa: { type: String, required: true },
    Costo: { type: Number, default: 0 },
    CostoPro: { type: Number, default: 0 },
    CostoAnt: { type: Number, default: 0 },
    CostoRepo: { type: Number, default: 0 },
    PresentacionBasica: {
      Unidad: { type: String },
      Factor: { type: Number },
      template: { type: String },
    },
    Presentaciones: [
      {
        Nombre: { type: String, required: true }, // Ej: UNIDAD, BLISTER, CAJA
        Factor: { type: Number, required: true, default: 1 }, // Relación con la unidad base
        Codigo: { type: String, required: true }, // Código de la presentación, debe ser único y uno igual al Codp
        Precio: { type: Number, default: 0 }, // Precio específico para la presentación
        NivelPrecio: { type: Number, default: 0 }, // Índice del nivel de precio a usar (0 = primer nivel, 1 = segundo nivel, etc.)
      },
    ],
    CapacidadContenido: {
      type: Number,
      default: 1, // Cantidad de unidades en la presentación
    },
    Image: {
      type: String,
      required: false,
      default: "",
    },
    ImageFs: { data: Buffer, contentType: String },
    IVA: {
      IVA_C: {
        Codp: { type: String, required: true },
        Impuesto: { type: Number, required: true },
      },
      IVA_V: {
        Codp: { type: String, required: true },
        Impuesto: { type: Number, required: true },
      },
    },
    Precios: [
      {
        Precio: { type: Number, default: 0 },
        Util: { type: Number, default: 0 },
        PrecioIva: { type: Number, default: 0 },
        PrecioFinal: { type: Number, default: 0 },
      },
    ],
    UpcAlt: [{ type: String }],
    CodigosAlt: [{ type: String }],
    Proveedores: [
      {
        Id: { type: String },
        Nombre: { type: String },
        Codp: { type: String },
        frecuencia: { type: Number, default: 0 },
        unidades: { type: Number, default: 0 },
        compras: [{ type: Schema.Types.ObjectId, ref: "Compras" }],
      },
    ],
    Stocks: [
      {
        Almacen: { type: String, required: true },
        Existencia: { type: Number, required: true },
        CtrlExist: {
          ExistMin: { type: Number, default: 0 },
          ExistMax: { type: Number, default: 0 },
        },
      },
    ],
    MermaPorc: { type: Number, default: 0 },
    LoteM: { type: Boolean, default: false },
    Lotes: [
      {
        Lote: { type: String },
        Vencimiento: {
          type: Date,
          required: false,
        },
        Costo: { type: Number, default: 0 },
        Precios: { type: Array, default: [] },
        Stock: { type: Number, default: 0 },
        Alm: { type: String },
      },
    ],
    isProduccion: { type: Boolean, default: false },
    manejaExist: { type: Boolean, default: true },
    Produccion: {
      Name: { type: String },
      ProductosAsociados: [
        {
          Codp: { type: String, required: true },
          Cantidad: { type: Number, required: true, default: 1 },
          Descrip: { type: String, required: true },
          Costo: { type: Number, required: true, default: 0 },
        },
      ],
      almacenProduccion: { type: String },
      CostoTotal: { type: Number, default: 0 },
      type: { type: String },
      UsaReceta: { type: Boolean, default: false },
      receta: { type: mongoose.Schema.Types.ObjectId, ref: "Recetas" },
    },
    Fecha: { type: Date, default: Date.now },
    FechaModificacion: { type: Date, default: Date.now },
    Usuario: { type: String, required: true },
    UsuarioModificacion: { type: String, required: true },
    InfoAdc: { type: Object, default: {} },
    Informacion: { type: String },
    Pedidos: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// create index Descrip
ProductosGeneralSchema.index({ Descrip: "text" });
//Codp es unico
ProductosGeneralSchema.index({ Codp: 1 }, { unique: true });
// create index Presentaciones.Codigo
//ProductosGeneralSchema.index({ "Presentaciones.Codigo": 1 }, { unique: true });
// Validación para evitar códigos duplicados
ProductosGeneralSchema.pre("validate", function (next) {
  if (this.Presentaciones && this.Presentaciones.length > 0) {
    const codigos = this.Presentaciones.map((p) => p.Codigo);
    const codigosSet = new Set(codigos);
    if (codigos.length !== codigosSet.size) {
      return next(
        new Error("No pueden haber códigos de presentación duplicados.")
      );
    }
    //no puede haber un codigo igual al producto base
    if (codigos.includes(this.Codp)) {
      return next(
        new Error("No puede haber un codigo igual al producto base.")
      );
    }
  }
  //si UpcAlternos es string, convertir a array
  if (this.UpcAlternos && typeof this.UpcAlternos === "string") {
    this.UpcAlternos = [this.UpcAlternos];
  }
  next();
});

module.exports = ProductosGeneralSchema;
