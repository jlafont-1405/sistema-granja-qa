const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importamos el modelo que acabamos de crear
const Producto = require('./models/Producto');
const Cliente = require('./models/Cliente');   
const Proveedor = require('./models/Proveedor'); 
const Venta = require('./models/Venta');
// Configuración inicial
const app = express();
const PORT = 4000;

// Middlewares
app.use(cors());
app.use(express.json()); // ¡Vital para entender los datos que llegan!
app.use(express.static('public'));

// Conexión a Base de Datos
// SOLO conectamos aquí si NO estamos en modo test.
// Si estamos en test, el archivo api.test.js se encargará de conectar.
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://127.0.0.1:27017/sistema-granja')
    .then(() => console.log('✅ Conexión exitosa a MongoDB (Local)'))
    .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));
}
// --- RUTAS DE LA API (Los endpoints) ---

// 1. RUTA PARA GUARDAR UN NUEVO PRODUCTO
// Método: POST | Url: http://localhost:4000/api/productos
app.post('/api/productos', async (req, res) => {
  try {
    console.log('📦 Intentando guardar:', req.body); // Para ver en consola qué llega

    // Creamos una instancia del modelo con los datos que recibimos
    const nuevoProducto = new Producto(req.body);
    
    // Lo guardamos en la base de datos
    await nuevoProducto.save();
    
    // Respondemos al cliente que todo salió bien
    res.status(201).json({ 
      mensaje: '¡Producto guardado exitosamente!',
      producto: nuevoProducto 
    });

  } catch (error) {
    console.error('Error al guardar:', error);
    // Si hay error (ej: código repetido), avisamos
    res.status(400).json({ 
      error: 'No se pudo guardar el producto.',
      detalle: error.message 
    });
  }
});

// 2. RUTA PARA BUSCAR POR CÓDIGO DE BARRAS (SCANNER)
// Método: GET | Url: http://localhost:4000/api/productos/:codigo
app.get('/api/productos/:codigo', async (req, res) => {
  try {
    const codigo = req.params.codigo;
    
    // Buscamos en la base de datos
    const productoEncontrado = await Producto.findOne({ codigoBarras: codigo });

    if (productoEncontrado) {
      res.json(productoEncontrado); // Devolvemos el producto
    } else {
      res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Error del servidor al buscar' });
  }
});

// 3. RUTA PARA VER TODO EL INVENTARIO
// Método: GET | Url: http://localhost:4000/api/productos
app.get('/api/productos', async (req, res) => {
  try {
    // .find() sin argumentos nos trae TODO lo que haya en la colección
    const productos = await Producto.find().sort({ fechaCreacion: -1 }); // Ordenado por el más nuevo
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el inventario' });
  }
});

// ==========================================
// 🔄 RUTAS DE MANTENIMIENTO DE PRODUCTOS
// ==========================================

// ACTUALIZAR PRODUCTO (PUT)
app.put('/api/productos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const datosNuevos = req.body;
    
    // { new: true } devuelve el producto ya actualizado
    const productoActualizado = await Producto.findByIdAndUpdate(id, datosNuevos, { new: true });
    
    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ mensaje: 'Producto actualizado', producto: productoActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// ELIMINAR PRODUCTO (DELETE)
// (Asegúrate de tener esta también, por si acaso)
app.delete('/api/productos/:id', async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});
// ... tus otras rutas ...

// 4. FUNCIÓN ELIMINAR (VERSIÓN MODERNA CON ANIMACIÓN)
        function eliminar(id) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás recuperar este producto una vez borrado.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33', // Rojo para peligro
                cancelButtonColor: '#3085d6', // Azul para cancelar
                confirmButtonText: 'Sí, borrarlo',
                cancelButtonText: 'Cancelar',
                background: '#f4f6f7', // Fondo suave
                backdrop: `
                    rgba(0,0,123,0.4)
                `
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // Si el usuario dijo que SÍ, procedemos a borrar
                    try {
                        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                        
                        // Mostramos mensaje de éxito
                        Swal.fire(
                            '¡Eliminado!',
                            'El producto ha sido borrado del inventario.',
                            'success'
                        );
                        
                        cargarInventario(); // Recargamos la tabla visualmente
                    } catch (error) {
                        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
                    }
                }
            })
        }

// 5. RUTA PARA ELIMINAR
// Método: DELETE | Url: http://localhost:4000/api/productos/:id
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Producto.findByIdAndDelete(id);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
});

// ... (Aquí están tus rutas de productos y venta) ...

// ==========================================
// 🧑‍🤝‍🧑 GESTIÓN DE CLIENTES
// ==========================================

// 7. Guardar Nuevo Cliente (MEJORADO)
app.post('/api/clientes', async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();
    res.status(201).json({ mensaje: 'Cliente registrado', cliente: nuevoCliente });
  } catch (error) {
    console.error(error); // Ver error en consola
    
    // Si el error es por duplicado (cédula repetida)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Esa Cédula ya está registrada' });
    }
    
    // Si el error es por falta de datos
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Faltan datos obligatorios (Nombre, Apellido o Cédula)' });
    }

    res.status(400).json({ error: 'Error desconocido al guardar' });
  }
});

// 8. Ver todos los Clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ nombre: 1 }); // Orden alfabético
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// 9. Buscar Cliente por Cédula (Para la facturación rápida)
app.get('/api/clientes/:cedula', async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ cedula: req.params.cedula });
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar cliente' });
  }
});

// 10. ELIMINAR CLIENTE
app.delete('/api/clientes/:id', async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});


// ==========================================
// 🚛 GESTIÓN DE PROVEEDORES
// ==========================================

// 10. Guardar Nuevo Proveedor
app.post('/api/proveedores', async (req, res) => {
  try {
    const nuevoProveedor = new Proveedor(req.body);
    await nuevoProveedor.save();
    res.status(201).json({ mensaje: 'Proveedor registrado', proveedor: nuevoProveedor });
  } catch (error) {
    res.status(400).json({ error: 'Error al registrar proveedor (¿RIF repetido?)' });
  }
});

// 11. Ver todos los Proveedores
app.get('/api/proveedores', async (req, res) => {
  try {
    const proveedores = await Proveedor.find().sort({ nombreEmpresa: 1 });
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

// 12. ELIMINAR PROVEEDOR
app.delete('/api/proveedores/:id', async (req, res) => {
  try {
    await Proveedor.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Proveedor eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar Proveedor' });
  }
});
// ... app.listen ...


// ==========================================
// 🛒 GESTIÓN DE VENTAS (FACTURACIÓN)
// ==========================================

// 13. PROCESAR UNA VENTA COMPLETA (CARRITO)
app.post('/api/ventas', async (req, res) => {
  const { cliente, items, total } = req.body;

  try {
    // PASO 1: Verificación de Stock (Antes de vender, revisamos si hay de todo)
    for (const item of items) {
      const productoDb = await Producto.findById(item.productoId);
      if (!productoDb || productoDb.stock < item.cantidad) {
        return res.status(400).json({ 
          error: `Stock insuficiente para: ${item.nombre}. Quedan: ${productoDb ? productoDb.stock : 0}` 
        });
      }
    }

    // PASO 2: Restar Inventario y Guardar
    // Si llegamos aquí, es porque SI hay stock de todo. Procedemos.
    for (const item of items) {
      await Producto.findByIdAndUpdate(item.productoId, { 
        $inc: { stock: -item.cantidad } // $inc significa "incrementar" (usamos negativo para restar)
      });
    }

    // PASO 3: Guardar la Factura en el Historial
    const nuevaVenta = new Venta({
      cliente: cliente || { nombre: "Consumidor Final", cedula: "N/A" },
      items: items,
      totalVenta: total
    });

    await nuevaVenta.save();

    res.status(201).json({ mensaje: '¡Venta procesada con éxito!', venta: nuevaVenta });

  } catch (error) {
    console.error("Error en venta:", error);
    res.status(500).json({ error: 'Error al procesar la venta' });
  }
});

// 13. VER HISTORIAL DE VENTAS
app.get('/api/ventas', async (req, res) => {
  try {
    // .sort({ fecha: -1 }) hace que salgan primero las más recientes
    const ventas = await Venta.find().sort({ fecha: -1 });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

// Arrancar el servidor

// MODIFICACIÓN PARA JEST:
// Solo iniciamos el servidor si NO estamos en modo de prueba
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
  });
}

// Exportamos la 'app' para que Jest la pueda usar
module.exports = app;

