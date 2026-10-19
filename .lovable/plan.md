# Acceso solo para compradores de Shopify

Nada se aplica hasta que confirmes este plan.

## A) Cambios de base de datos
1. Nueva tabla `purchases`: id, shopify_order_id (único), email (se guarda siempre en minúsculas y sin espacios, forzado por la base), status (active / refunded / error), error_message (opcional), created_at.
   - Sin acceso desde el navegador para usuarios comunes; solo el servidor lee y escribe.
   - Lectura para admin con el mismo patrón que ya usan las otras tablas (`has_role(..., 'admin')`).
2. Cuenta completada: agrego `profiles.account_completed_at` (fecha). Se guarda al terminar /registro mediante una función segura que solo marca la cuenta propia. Las cuentas que ya existen hoy y ya tienen contraseña quedan marcadas como completas, para que no reciban invitaciones.
3. Nueva tabla `access_requests`: email, requested_at. Sin acceso público; solo el servidor.
4. No cambio ninguna política de lectura de admin existente.

## B) Aviso de Shopify (pedido pagado)
- Dirección pública: `https://neurohack21.com/api/public/shopify/orders-paid`.
- Verifica la firma de Shopify con `SHOPIFY_WEBHOOK_SECRET`; sin secreto o con firma incorrecta responde 401 y no hace nada.
- Solo procesa `orders/paid`; email de `order.email` o `order.customer.email`.
- Filtra por `SHOPIFY_PRODUCT_IDS`; si no está cargado, acepta todo y lo avisa en la respuesta.
- Pedido repetido: 200 sin hacer nada. Pedido nuevo: se guarda como active y se envía la invitación (plantilla ya diseñada) con enlace a `https://neurohack21.com/registro`. Si el email ya tiene cuenta, no se invita. Si falla, queda con status error y el motivo, y responde 200.
- En los registros solo quedan número de pedido y email.

## C) Pedir un acceso nuevo
- Dirección pública que recibe un email. Máximo un envío por email cada 2 minutos.
- Compra active y cuenta sin completar: se reenvía la invitación. Si la cuenta invitada ya existe, se usa un enlace de invitación nuevo y, si el sistema no lo permite, un enlace de acceso único hacia /registro (te digo cuál quedó).
- Cuenta completa: email de restablecer contraseña actual.
- Sin compra: no se envía nada.
- Respuesta siempre igual: “Si tu email tiene acceso, te enviamos un correo en los próximos minutos. Revisá también spam y promociones.”

## D) Pantalla /registro
- Con invitación válida: email bloqueado con la nota indicada, título “Qué gusto verte acá”, “contraseña de al menos 8 caracteres” (exigido), párrafo final “Con tu contraseña vas a poder ingresar desde cualquier dispositivo.”, botón “CREAR MI CUENTA” con carga. Guarda nombre (donde ya se guarda) y contraseña en la cuenta invitada, sin crear otra ni mandar “Confirmar email”. Errores debajo del campo. Al terminar va a Inicio con Onboarding sin cambios.
- Sin invitación: “Este enlace ya no está disponible.”, “Ingresá tu email y, si tiene acceso, te enviamos uno nuevo.”, campo email y botón “PEDIR UN ACCESO NUEVO” mostrando la respuesta.

## E) Cierre del registro abierto (al final)
- Único cambio en autenticación: desactivar el registro público (signup off). Todo lo demás queda igual (confirmación de email, contraseñas filtradas, anónimos, etc.).
- Verifico que la invitación desde el servidor siga funcionando.
- Hoy el login no tiene enlace “Crear cuenta”; reviso y quito cualquier otro acceso a registro propio. Sin enlaces nuevos en el login.

## Al terminar
URL para Shopify, cómo cargar los dos secretos (te abro el formulario seguro), duración del enlace de invitación, cambio aplicado en el registro, y capturas de ambos estados de /registro.

## Detalles técnicos
- Rutas de servidor: `src/routes/api/public/shopify/orders-paid.ts` y `src/routes/api/public/access-request.ts`; HMAC con Web Crypto (workerd), comparación en tiempo constante, Zod para entradas, cliente admin cargado dentro del handler.
- Invitación: `auth.admin.inviteUserByEmail(email, { redirectTo })`; reenvío para invitado sin confirmar vía `inviteUserByEmail` de nuevo o `generateLink` + envío.
- /registro: `updateUser({ password, data: { full_name } })`, actualización de `profiles.full_name` y RPC `complete_account()`.
