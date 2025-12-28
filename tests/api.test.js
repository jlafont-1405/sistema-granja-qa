const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Importamos tu servidor

// ANTES DE TODO: Conectamos a una Base de Datos de PRUEBA
// (Para no borrar los datos reales de la granja)
beforeAll(async () => {
  const url = 'mongodb://127.0.0.1:27017/sistema-granja-test'; // Nombre diferente DB
  await mongoose.connect(url);
});

// DESPUÉS DE TODO: Cerramos la conexión y el servidor
afterAll(async () => {
  await mongoose.connection.close();
});

// --- AQUÍ EMPIEZAN LAS PRUEBAS ---
describe('Pruebas del Sistema de Granja', () => {

  // PRUEBA 1: Verificar que el endpoint de productos funciona
  test('GET /api/productos debería responder con status 200 y ser un array JSON', async () => {
    // Le pedimos a 'supertest' que haga un GET
    const response = await request(app).get('/api/productos');
    
    // Verificamos el resultado (Expectativas)
    expect(response.statusCode).toBe(200); // Que el servidor diga "OK"
    expect(Array.isArray(response.body)).toBe(true); // Que nos devuelva una lista
  });

  // PRUEBA 2: Intentar buscar una ruta que no existe
  test('GET /api/ruta-falsa debería dar error 404', async () => {
    const response = await request(app).get('/api/ruta-falsa');
    expect(response.statusCode).toBe(404);
  });

});

// PRUEBA 3: Verificar que se puede crear un producto
  test('POST /api/productos debería guardar un producto nuevo', async () => {
    // 1. Datos que vamos a enviar (Simulamos el formulario)
    const nuevoProducto = {
      codigoBarras: "TEST-999",
      nombre: "Producto de Prueba Jest",
      precio: 50,
      stock: 10
    };

    // 2. Hacemos la petición POST
    const response = await request(app)
      .post('/api/productos')
      .send(nuevoProducto); // Enviamos los datos

    // 3. Verificaciones (El Juez)
    expect(response.statusCode).toBe(201); // ¿Respondió "Creado"?
    expect(response.body.producto.nombre).toBe("Producto de Prueba Jest"); // ¿Devolvió el nombre correcto?
    expect(response.body.producto.codigoBarras).toBe("TEST-999"); // ¿Guardó el código?
  });