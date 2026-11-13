# InterApp — proyecto base

Aplicación web de intercambio construida desde cero con HTML, CSS, JavaScript ES Modules y Bootstrap 5.

## Funcionalidades
- Registro e inicio de sesión de demostración.
- Dashboard con estadísticas.
- Registro, edición, búsqueda y eliminación de productos.
- Carga y vista previa de imágenes.
- Estados de producto: disponible, pendiente e intercambio realizado.
- Vista de intercambios en curso y completados.
- Diseño adaptable a móviles.

## Ejecutar
Por utilizar módulos JavaScript, abre el proyecto mediante un servidor estático local (no directamente con `file://`).

Por ejemplo, desde la carpeta del proyecto:
```bash
python -m http.server 8000
```
Luego visita `http://localhost:8000`.

## Limitaciones importantes de esta versión
Esta entrega es un **prototipo funcional local**, no una aplicación multiusuario de producción:
- Los usuarios, contraseñas, productos, imágenes e intercambios se guardan en `localStorage` del navegador.
- Las contraseñas se guardan en texto plano únicamente para facilitar la demostración. No uses este mecanismo en producción.
- Los registros no se sincronizan entre dispositivos ni entre navegadores.
- La opción de proponer intercambio crea un registro de demostración asociado a la cuenta actual; no envía una solicitud real a otro usuario.
- No hay backend, API, base de datos remota, control de acceso del servidor ni almacenamiento remoto de imágenes.

## Antes de publicar
1. Integrar autenticación segura en servidor o proveedor (por ejemplo, Firebase Auth o Supabase Auth).
2. Crear tablas/colecciones para usuarios, productos, intercambios e historial.
3. Usar almacenamiento de objetos para imágenes y guardar solo sus URLs en los registros.
4. Validar permisos y propiedad en el backend/reglas de seguridad.
5. Hacer la aceptación y finalización de intercambios mediante operaciones atómicas para evitar reservas simultáneas.
6. No incluir secretos ni claves privadas en el frontend.

## Identidad visual
Se incorporaron los dos logotipos suministrados:
- `assets/images/logo-interapp.png`: logotipo azul/naranja para fondos claros.
- `assets/images/logo-interapp-blanco.png`: versión blanca para fondos oscuros.

Paleta principal tomada del logotipo: azul `#233F83`, naranja `#FF4D00` y blanco.

- `assets/images/banner-interapp.png`: banner principal integrado en la página de inicio.

## Últimas mejoras
- El botón **Proponer** abre un formulario para indicar el producto que se desea recibir y un mensaje opcional; crea una propuesta local y pasa el producto ofrecido a estado pendiente.
- **Editar** permite actualizar productos disponibles.
- **Eliminar** permite borrar productos disponibles o completados; no permite borrar productos con un intercambio en curso.
- En la pestaña **Completados**, el botón **Eliminar producto e historial** elimina el registro completado y los productos vinculados de la cuenta local.
- El logo original queda centrado y con el mismo tratamiento en login y registro.

## Banners rotativos en inicio y dashboard
El mismo carrusel se monta en `index.html` y `pages/dashboard.html` mediante `js/banner.js`.
- La imagen actual es `assets/images/banner-interapp.png`.
- Para agregar más banners, copia los archivos a `assets/images/banners/`.
- Después abre `js/banner.js` y agrega cada imagen al arreglo `slides`, por ejemplo:
  `{ image: "banners/banner-02.jpg", alt: "Descripción de la imagen" }`.
- Las imágenes cambian automáticamente cada 5 segundos cuando hay más de una; también aparecen flechas y puntos de navegación.
- El enlace del botón cambia según la página: registro en inicio y productos en dashboard.

### Banners incorporados
Se añadieron tres banners proporcionados para el carrusel:
- `assets/images/banners/banner-01.webp`
- `assets/images/banners/banner-02.webp`
- `assets/images/banners/banner-03.webp`

El carrusel también conserva el banner original `assets/images/banner-interapp.png`. Las cuatro imágenes se muestran tanto en el inicio como en el dashboard.
