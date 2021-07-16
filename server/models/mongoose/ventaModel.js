const mongoose = require("mongoose");

const ventaSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    min: 1,
  },
  denominacion: {
    type: String,
    required: true,
    trim: true,
  },
  unidad_medida: {
    type: String,
    required: true,
    trim: true,
  },
  codigo_ean: {
    type: Number,
    required: true,
    min: 1,
  },
  cantidad_vend: {
    type: Number,
    required: true,
    min: 1,
  }, // CANTIDAD 1
  cantidad_prod: {
    type: Number,
    required: true,
    min: 1,
  }, // CANTIDAD 1
  precio: {
    type: Number,
    required: true,
    min: 1,
  },
  fecha: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
const Venta = mongoose.model("Venta", ventaSchema);
module.exports = Venta;
