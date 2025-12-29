const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Importamos tu servidor
const Producto = require('../models/Producto');

// Configuración antes de todas las pruebas
beforeAll(async () => {
    // Conectamos a una base de datos de prueba separada para no borrar tus datos reales
    const url = 'mongodb://127.0.0.1:27017/sistema-granja-test';
    await mongoose.connect(url);
});

// Limpieza después de cada prueba
afterEach(async () => {
    await Producto.deleteMany(); // Borramos los productos para empezar limpio
});

// Desconexión al final
afterAll(async () => {
    await mongoose.connection.close();
});

describe('PRUEBA DE CONCURRENCIA (RACE CONDITION)', () => {
    
    test('Debe evitar vender más stock del disponible cuando llegan 2 peticiones simultáneas', async () => {
        // 1. PREPARACIÓN: Creamos un producto con SOLO 1 unidad de stock
        const producto = await Producto.create({
            codigoBarras: "TEST-001",
            nombre: "Producto Limitado",
            precio: 10,
            stock: 1 // <--- LA TRAMPA: Solo hay uno
        });

        const idProducto = producto._id;

        // 2. EL ATAQUE: Preparamos dos peticiones de compra idénticas
        const compra = {
            items: [{ productoId: idProducto, nombre: "Producto Limitado", cantidad: 1 }],
            total: 10
        };

        // Promise.all dispara ambas "balas" al mismo tiempo
        const resultados = await Promise.all([
            request(app).post('/api/ventas').send(compra),
            request(app).post('/api/ventas').send(compra)
        ]);

        // 3. ANÁLISIS DE RESULTADOS
        const respuesta1 = resultados[0];
        const respuesta2 = resultados[1];

        console.log('Respuesta 1:', respuesta1.status, respuesta1.body);
        console.log('Respuesta 2:', respuesta2.status, respuesta2.body);

        // 4. VERIFICACIÓN (ASERCIONES)
        // Una debe ser 201 (Éxito) y la otra 400 (Error de Stock)
        // No sabemos cuál llegará primero, así que sumamos los códigos de estado.
        // Esperamos un 201 + 400.
        const codigos = [respuesta1.status, respuesta2.status].sort();
        
        expect(codigos).toEqual([201, 400]); // <--- ESTO ES LO QUE DEFINE EL ÉXITO
    });
});