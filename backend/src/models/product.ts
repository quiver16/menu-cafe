import { Schema, model, Document, Types } from 'mongoose';

// --- Interfaces Secundarias ---
interface IPresentacionBasica {
    Unidad?: string;
    Factor?: number;
    template?: string;
}

interface IPresentacion {
    Nombre: string;
    Factor: number;
    Codigo: string;
    Precio?: number;
    NivelPrecio?: number;
}

interface IIvaDetalle {
    Codp: string;
    Impuesto: number;
}

interface IPrecio {
    Precio: number;
    Util: number;
    PrecioIva: number;
    PrecioFinal: number;
}

interface IProveedor {
    Id?: string;
    Nombre?: string;
    Codp?: string;
    frecuencia: number;
    unidades: number;
    compras: Types.ObjectId[];
}

interface IStock {
    Almacen: string;
    Existencia: number;
    CtrlExist: {
        ExistMin: number;
        ExistMax: number;
    };
}

interface ILote {
    Lote?: string;
    Vencimiento?: Date;
    Costo: number;
    Precios: any[];
    Stock: number;
    Alm?: string;
}

interface IProduccionAsociado {
    Codp: string;
    Cantidad: number;
    Descrip: string;
    Costo: number;
}

interface IProduccion {
    Name?: string;
    ProductosAsociados: IProduccionAsociado[];
    almacenProduccion?: string;
    CostoTotal: number;
    type?: string;
    UsaReceta: boolean;
    receta?: Types.ObjectId;
}

export interface IProductosGeneral extends Document {
    Codp: string;
    Descrip: string;
    DescripCorta: string;
    Ref?: string;
    Unidad?: string;
    lineap?: string;
    Departa?: string;
    Categoria?: string;
    SubCategoria?: Types.ObjectId[];
    PrincipioActivo?: string;
    UpcAlternos: string[];
    Marca?: string;
    Divisa: string;
    Costo: number;
    CostoPro: number;
    CostoAnt: number;
    CostoRepo: number;
    PresentacionBasica: IPresentacionBasica;
    Presentaciones: IPresentacion[];
    CapacidadContenido: number;
    Image?: string;
    ImageFs?: { data: Buffer; contentType: string };
    IVA: {
        IVA_C: IIvaDetalle;
        IVA_V: IIvaDetalle;
    };
    Precios: IPrecio[];
    UpcAlt: string[];
    CodigosAlt: string[];
    Proveedores: IProveedor[];
    Stocks: IStock[];
    MermaPorc: number;
    LoteM: boolean;
    Lotes: ILote[];
    isProduccion: boolean;
    manejaExist: boolean;
    Produccion: IProduccion;
    Fecha: Date;
    FechaModificacion: Date;
    Usuario: string;
    UsuarioModificacion: string;
    InfoAdc: Record<string, any>;
    Informacion?: string;
    Pedidos: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const ProductosGeneralSchema = new Schema<IProductosGeneral>(
    {
        Codp: { type: String, required: true, unique: true },
        Descrip: { type: String, required: true },
        DescripCorta: { type: String, default: "" },
        Ref: { type: String },
        Unidad: { type: String },
        lineap: { type: String },
        Departa: { type: String },
        Categoria: { type: String },
        SubCategoria: [{ type: Schema.Types.ObjectId, ref: "SubCategorias" }],
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
                Nombre: { type: String, required: true },
                Factor: { type: Number, required: true, default: 1 },
                Codigo: { type: String, required: true },
                Precio: { type: Number, default: 0 },
                NivelPrecio: { type: Number, default: 0 },
            },
        ],
        CapacidadContenido: { type: Number, default: 1 },
        Image: { type: String, default: "" },
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
                Vencimiento: { type: Date },
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
            receta: { type: Schema.Types.ObjectId, ref: "Recetas" },
        },
        Fecha: { type: Date, default: Date.now },
        FechaModificacion: { type: Date, default: Date.now },
        Usuario: { type: String, required: true },
        UsuarioModificacion: { type: String, required: true },
        InfoAdc: { type: Schema.Types.Mixed, default: {} },
        Informacion: { type: String },
        Pedidos: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const productosgenerals = model<IProductosGeneral>("productosgenerals", ProductosGeneralSchema);

export default productosgenerals;