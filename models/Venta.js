// models/Venta.js
const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  // Guardamos quién compró (Opcional, puede ser "Cliente Casual")
  cliente: {
    nombre: String,
    cedula: String
  },
  // Aquí guardamos la LISTA de cosas que llevó
  items: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
      codigo: String,
      nombre: String,
      precio: Number, // Guardamos el precio al momento de la venta (por si sube mañana)
      cantidad: Number,
      subtotal: Number
    }
  ],
  totalVenta: { type: Number, required: true },
  fecha: { type: Date, default: Date.now }
});

const Venta = mongoose.model('Venta', ventaSchema);
module.exports = Venta;