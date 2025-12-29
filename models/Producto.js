// models/Producto.js
const mongoose = require('mongoose');

// 1. Definimos el esquema (Los planos)
const productoSchema = new mongoose.Schema({
  codigoBarras: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
stock: {
    type: Number,
    required: true,
    min: 0, // <--- ESTA LÍNEA ES EL ESCUDO FINAL
    default: 0
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

// 2. IMPORTANTE: Creamos el modelo Y LO EXPORTAMOS
// Si falta esta línea, index.js recibe un objeto vacío y falla.
const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;