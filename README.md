🚜 Granja - POS & Inventory System
Sistema integral de Punto de Venta (POS) y Gestión de Inventario diseñado bajo una arquitectura SPA (Single Page Application) para una distribuidora de insumos agrícolas. El sistema prioriza la velocidad de atención en caja mediante la integración de hardware HID (lectores de códigos de barra).

🛠️ Stack Tecnológico (MEVN Lite)
Backend: Node.js con Express (Arquitectura No-bloqueante).

Base de Datos: MongoDB con Mongoose como ODM para validación de esquemas.

Frontend: HTML5, CSS3 (Grid/Flexbox) y Vanilla JavaScript (ES6+) para una carga ultraligera.

Testing: Suite de pruebas automatizadas con Jest y Supertest.

✨ Funcionalidades Clave
Facturación Transaccional: Módulo de "Caja" basado en estados locales (carrito en memoria) para cálculos instantáneos antes de la persistencia.

Gestión CRUD Completa: Control total sobre Productos, Clientes y Proveedores con validaciones de integridad (Cédulas/RIF únicos).

Lógica de Inventario: Descuento automático de stock mediante operadores atómicos de MongoDB ($inc) para prevenir inconsistencias.

Reportes y Auditoría: Histórico de ventas con desnormalización de datos para garantizar la integridad de precios históricos.

UX Profesional: Feedback interactivo mediante SweetAlert2 y notificaciones tipo Toast para operaciones rápidas.

🧪 Calidad y Pruebas
El sistema cuenta con una capa de Testing Automatizado que utiliza un entorno de base de datos aislado (sistema-granja-test) para garantizar que las nuevas funcionalidades no afecten los datos reales de producción.

Dato Técnico: El sistema es Local-First, funcionando en una red LAN sin necesidad de conexión a internet, lo que garantiza estabilidad total en entornos rurales.

🚀 Instalación
Clonar repositorio.

Ejecutar yarn install para reconstruir las dependencias.

Iniciar en desarrollo: yarn dev (vía Nodemon).

Correr pruebas: yarn test (vía Jest con cross-env).
