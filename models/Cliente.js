// models/Cliente.js
const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  cedula: {
    type: String,
    required: true,
    unique: true, // ¡Vital! No pueden haber dos clientes con la misma cédula
    trim: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  telefono: {
    type: String,
    default: "Sin teléfono"
  },
  ciudad: {
    type: String,
    default: "Local"
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;