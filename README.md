# Neurohack 21

Estoy construyendo "Neurohack 21", un libro interactivo (mini app web) que acompaña un reto de 21 días combinando neurociencia de la atención y psicología junguiana. Es un producto digital de mi marca "Destello Interior", vendido como pago único a través de Shopify.

STACK Y ARQUITECTURA
Conectá Supabase desde el inicio, lo vamos a necesitar para todo:

- Autenticación por email (magic link o email/contraseña), cuentas individuales por comprador.
- El progreso de cada usuario debe sincronizarse entre dispositivos (la persona puede entrar desde el celular y la notebook y ver lo mismo), así que todo el estado vive en la base de datos, no en localStorage.
- Más adelante voy a conectar un webhook de Shopify para otorgar acceso automáticamente al comprar, pero eso lo configuramos en un paso posterior. Por ahora, dejame crear usuarios de prueba manualmente.

MODELO DE DATOS (creá estas tablas base en Supabase, con relación al usuario autenticado vía RLS):

- profiles: datos del usuario (email, fecha de compra, fecha de
primer login, estado de acceso: activo/pendiente/revocado)
- daily_logs: un registro por día del reto (1 a 21) por usuario, con:
fecha y hora, checklist de práctica corporal (escaneo corporal,
respiración de coherencia cardíaca, visualización dirigida — cada uno booleano), tag(s) de "cómo llegué antes de empezar" (selección de chips predefinidos: Tenso/a, Disperso/a, Tranquilo/a, Ansioso/a, Motivado/a, Cansado/a, más un campo "otro" opcional de texto libre), reflexión escrita (texto largo), nivel de foco del día (entero 1-10), si faltó a la práctica ese día (booleano) y cómo lo retomó (texto corto, opcional, solo aplica si faltó=true)
- focus_assessments: las 4 mediciones de la Autoevaluación de Foco por usuario (momento: pre-día1 / cierre-semana1 / cierre-semana2 / día21; las 10 respuestas individuales 1-5; el puntaje total ya calculado 10-50; fecha)
- implementation_intentions: los planes "si pasa X, entonces hago Y" que el usuario guarda (hasta 3-5 por usuario) más su "ritual mínimo de mantenimiento" (texto)
- resource_usage_events: registro liviano de cada vez que un usuario abre el Kit de Emergencia, copia un guion, o busca un término en el Glosario (solo nombre del recurso, usuario, timestamp — para poder ver en el panel de admin si un recurso se usa o no)

Además necesito un rol de administrador (solo yo) con acceso a un
panel separado y protegido, distinto del resto de la app, que vamos a construir en un paso posterior.

ARQUITECTURA DE NAVEGACIÓN
Armá el esqueleto completo de navegación (con pantallas placeholder, las vamos a ir completando una por una), con esta estructura:

- Portada / login por email
- Menú principal, con acceso a:
    - Índice de Contenidos (Prólogo, Cómo usar este libro interactivo, Parte I: Módulos 1-3, Parte II: Módulos 4-6, Parte III: El Reto de 21 días, Parte IV: Módulos 7-8, Conclusiones, Bibliografía)
    - Autoevaluación de Foco
    - Kit de Emergencia Anti-Distracción
    - Registro Diario de 21 Días
    - Tracker Visual de 21 Días
    - Guiones Listos para Proteger tu Foco
    - Glosario de Términos
- Política de Privacidad y Términos de Uso (accesibles desde el menú)

DISEÑO
Ya tengo el diseño completo hecho en Figma. Te voy a ir pasando el
link de Figma (o usando el plugin de Lovable para Figma) pantalla por pantalla, a medida que construyamos cada sección, para que uses ese diseño exacto como referencia (colores, tipografía, spacing, componentes). No inventes un estilo visual propio todavía.

IMPORTANTE: por ahora, solo quiero que quede armada la base técnica (Supabase conectado, tablas creadas, autenticación funcionando, y el esqueleto de navegación con pantallas vacías). Todavía no construyas el contenido ni el diseño final de cada pantalla, eso lo vamos a hacer juntos en los próximos mensajes, una sección a la vez.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://neurohack21.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fa6e2797-ada5-4778-9444-b2c91fb079c4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
