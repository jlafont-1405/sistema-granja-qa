// models/Proveedor.js
const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
  rif: {
    type: String,
    required: true,
    unique: true, // El RIF es único
    uppercase: true, // Se guarda siempre en mayúsculas (ej: J-12345)
    trim: true
  },
  nombreEmpresa: {
    type: String,
    required: true
  },
  categoria: {
    type: String, // Ej: "Alimentos", "Medicinas", "Ferretería"
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  direccion: {
    type: String
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

const Proveedor = mongoose.model('Proveedor', proveedorSchema);

module.exports = Proveedor;