# 🚜 Granja - POS & Inventory System

Sistema integral de Punto de Venta (POS) y Gestión de Inventario diseñado para una distribuidora de insumos agrícolas. El proyecto utiliza una arquitectura **SPA (Single Page Application)** para garantizar una experiencia fluida y rápida, ideal para la atención directa al cliente.

## 🛠️ Stack Tecnológico (MEVN Lite)
* **Backend:** Node.js con Express, utilizando una arquitectura de E/S no bloqueante (Event Loop).
* **Base de Datos:** MongoDB (NoSQL) para una gestión flexible de productos y ventas.
* **ODM:** Mongoose para la definición estricta de esquemas y validación de integridad de datos.
* **Frontend:** HTML5, CSS3 y Vanilla JavaScript (ES6+) para mantener el sistema ligero y eficiente.
* **Testing:** Suite de pruebas automatizadas con **Jest** y **Supertest**.

## ✨ Funcionalidades Principales
* **Módulo POS (Punto de Venta):** Interfaz optimizada para lectores de códigos de barra (HID) con carga asíncrona de productos.
* **Gestión Transaccional:** Uso de estados locales (carrito en memoria) y cálculos automáticos de totales y tributos antes de facturar.
* **Integración de Actores:** CRUD completo para la gestión de Clientes y Proveedores con índices únicos para evitar duplicidad.
* **Lógica de Inventario:** Descuento automático de stock mediante operaciones atómicas (`$inc`) en la base de datos.
* **Auditoría de Ventas:** Registro histórico desnormalizado para preservar la integridad de los precios al momento de la venta.

## 🛡️ Calidad de Software (Testing)
El sistema implementa pruebas unitarias e integración para asegurar que los endpoints críticos (ventas, productos, clientes) funcionen correctamente.
* **Ambientes Separados:** Uso de `cross-env` para trabajar en un entorno de pruebas aislado, protegiendo la base de datos de producción.
* **Simulación de Clientes:** Implementación de Supertest para simular peticiones HTTP y validar códigos de estado (200, 201, 404).

## 🚀 Instalación y Ejecución
1. **Clonar el repositorio:** `git clone https://github.com/jlafont-1405/sistema-granja.git`
2. **Instalar dependencias:** `yarn install`
3. **Modo Desarrollo:** `yarn dev` (con recarga automática vía Nodemon).
4. **Ejecutar Pruebas:** `yarn test` (entorno seguro con base de datos de prueba).

---
> **Nota de Ingeniería:** Este sistema es **Local-First**, lo que permite su funcionamiento total en redes LAN sin dependencia de conexión a internet.
