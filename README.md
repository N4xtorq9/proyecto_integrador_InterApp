# InterApp

Aplicación web de intercambio de productos desarrollada como proyecto  
integrador del CESDE. La plataforma permite a los usuarios registrar  
productos, explorar artículos disponibles y gestionar propuestas de  
intercambio desde una interfaz sencilla y adaptable.

## Descripción del proyecto

**InterApp** busca facilitar el intercambio de productos entre usuarios,  
ofreciendo un espacio digital en el que se pueden publicar artículos,  
consultar su información y proponer intercambios.

Esta versión corresponde a un prototipo funcional de ejecución local. La  
información se almacena en el navegador mediante `localStorage`, por lo  
que no existe sincronización entre diferentes dispositivos o  
navegadores.

## Funcionalidades principales

- Registro e inicio de sesión de demostración.
- Panel principal (*dashboard*) con estadísticas.
- Registro, edición, búsqueda y eliminación de productos.
- Carga y vista previa de imágenes de los productos.
- Gestión de estados de los productos:
  - Disponible.
  - Pendiente.
  - Intercambio realizado.
- Visualización de intercambios en curso y completados.
- Formulario para proponer un intercambio, indicando el producto que  
  se desea recibir y un mensaje opcional.
- Carrusel de banners en la página de inicio y en el dashboard.
- Interfaz adaptable a dispositivos móviles.

## Tecnologías utilizadas

Tecnología Uso

* * *

HTML5 Estructura de las páginas  
CSS3 Estilos y diseño visual  
JavaScript ES Modules Lógica e interacción de la aplicación  
Bootstrap 5 Componentes y diseño adaptable  
`localStorage` Almacenamiento local de datos en el navegador

## Estructura del proyecto

```
proyecto_integrador_InterApp/
├── assets/
│   └── images/
│       ├── banners/
│       ├── logo-interapp.png
│       ├── logo-interapp-blanco.png
│       └── banner-interapp.png
├── css/
├── js/
├── pages/
├── index.html
└── README.md
```

- `assets/images/`: recursos gráficos, logotipos y banners.
- `css/`: hojas de estilo de la aplicación.
- `js/`: módulos JavaScript y lógica de funcionamiento.
- `pages/`: páginas adicionales de la plataforma.
- `index.html`: punto de entrada de la aplicación.
- `README.md`: documentación del proyecto.

## Instalación y ejecución

Como el proyecto utiliza módulos JavaScript, debe ejecutarse mediante un  
servidor local. No se recomienda abrir directamente el archivo  
`index.html` con el protocolo `file://`.

### Requisitos

- Un navegador web actualizado.
- Python instalado, para utilizar el servidor local incluido en sus  
  herramientas.

### Pasos

1. Clonar el repositorio:
   
   ```
   git clone https://github.com/N4xtorq9/proyecto_integrador_InterApp.git
   ```
   
2. Ingresar a la carpeta:
   
   ```
   cd proyecto_integrador_InterApp
   ```
   
3. Iniciar un servidor HTTP local:
   
   ```
   python -m http.server 8000
   ```
   
4. Abrir en el navegador:
   
   ```
   http://localhost:8000
   ```
   

## Identidad visual

La identidad gráfica de InterApp utiliza una paleta basada en los  
colores del logotipo:

- **Azul:** `#233F83`
- **Naranja:** `#FF4D00`
- **Blanco:** color complementario para fondos y contraste.

El repositorio incluye dos versiones del logotipo:

- `assets/images/logo-interapp.png`: versión para fondos claros.
- `assets/images/logo-interapp-blanco.png`: versión para fondos  
  oscuros.

También incluye un banner principal y un carrusel de imágenes para la  
página de inicio y el dashboard.

### Administración de banners

Las imágenes del carrusel se almacenan en:

```
assets/images/banners/
```

Para incorporar nuevos banners:

1. Copiar la imagen a la carpeta `assets/images/banners/`.
2. Abrir el archivo `js/banner.js`.
3. Agregar la ruta de la imagen y su texto alternativo al arreglo  
   `slides`, siguiendo el formato utilizado por los elementos  
   existentes.

El carrusel cambia automáticamente cada cinco segundos cuando hay más de  
una imagen y permite la navegación mediante flechas y puntos de control.

## Funcionamiento de los intercambios

El usuario puede publicar productos y gestionar su disponibilidad. Al  
proponer un intercambio, puede seleccionar o indicar el producto que  
desea recibir y agregar un mensaje opcional.

La propuesta se registra localmente como parte de la demostración. El  
estado del producto ofrecido cambia a **pendiente** para representar que  
está asociado a un proceso de intercambio.

La aplicación también permite consultar los intercambios en curso y los  
que ya se marcaron como completados.

> **Importante:** en esta versión, las propuestas no se envían realmente  
> a otra cuenta. El registro se realiza en el almacenamiento local del  
> navegador.

## Limitaciones de la versión actual

Esta entrega es un prototipo funcional local y no debe considerarse una  
aplicación multiusuario lista para producción.

- Los usuarios, contraseñas, productos, imágenes e intercambios se  
  almacenan en `localStorage`.
- Las contraseñas se guardan en texto plano con fines demostrativos.  
  Este mecanismo no es seguro para un entorno real.
- La información no se sincroniza entre navegadores ni dispositivos.
- No existe backend, API ni base de datos remota.
- No hay almacenamiento remoto de imágenes.
- Las propuestas de intercambio son registros de demostración y no  
  generan solicitudes reales entre usuarios.
- La validación y el control de permisos no se realizan desde un  
  servidor.

## Recomendaciones para una futura versión

Para evolucionar InterApp hacia una aplicación multiusuario de  
producción, se recomienda:

1. Implementar autenticación segura mediante un backend o un proveedor  
   como Firebase Authentication o Supabase Auth.
2. Crear una base de datos para usuarios, productos, propuestas,  
   intercambios e historial.
3. Implementar almacenamiento de imágenes en un servicio externo y  
   guardar sus URL en la base de datos.
4. Validar desde el servidor la identidad del usuario, la propiedad de  
   los productos y los permisos de cada operación.
5. Gestionar la aceptación y finalización de intercambios mediante  
   operaciones atómicas, evitando que un mismo producto quede  
   comprometido en varias propuestas simultáneas.
6. No incluir contraseñas, claves privadas ni secretos en el código del  
   frontend.
7. Incorporar notificaciones reales para informar a los usuarios sobre  
   las propuestas y sus cambios de estado.

## Autoría

**Proyecto Integrador -- CESDE**

Repositorio:  
[proyecto\_integrador\_InterApp](https://github.com/N4xtorq9/proyecto_integrador_InterApp)