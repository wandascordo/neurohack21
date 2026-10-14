import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { meta } from "@/components/Placeholder";

export const Route = createFileRoute("/politica-de-privacidad")({
  head: () => meta("Políticas de privacidad", "Cómo tratamos tus datos personales en Neurohack 21, de Destello Interior."),
  component: Privacy,
});

function Email() {
  return <a href="mailto:neurohack21@gmail.com">neurohack21@gmail.com</a>;
}

function Privacy() {
  return (
    <LegalPage title="Políticas de privacidad" updated="14 de octubre de 2026">
      <section>
        <h2>1. Quién es responsable de tus datos</h2>
        <p>El responsable del tratamiento de tus datos es Destello Interior. Contacto: <Email />.</p>
      </section>
      <section>
        <h2>2. Qué datos recopilamos</h2>
        <ul>
          <li><strong>Datos de cuenta:</strong> tu email, que usamos para darte acceso.</li>
          <li><strong>Datos de compra:</strong> la confirmación de tu compra y el email asociado. No recibimos ni guardamos datos de tu tarjeta.</li>
          <li><strong>Tu progreso:</strong> qué módulos y días completaste, los puntajes de tus autoevaluaciones y la fecha de cada una, y las calificaciones de foco.</li>
          <li><strong>Lo que escribís en la app:</strong> tus respuestas del Registro Diario, tus notas de Mis notas, tu ritual mínimo y tus intenciones. Estos textos pueden incluir información personal o sensible sobre tus pensamientos, emociones o hábitos. Te pedimos que no escribas datos de terceros ni información que prefieras no registrar.</li>
          <li><strong>Uso del Botón Anti-Distracción:</strong> registramos cuándo lo usás, para que puedas ver tu propio uso y para entender cómo se usa el producto.</li>
          <li><strong>Datos técnicos:</strong> tipo de dispositivo y navegador, y datos mínimos de sesión necesarios para que la app funcione.</li>
        </ul>
      </section>
      <section>
        <h2>3. Para qué usamos tus datos</h2>
        <ul>
          <li>Darte acceso y permitir que tu progreso se guarde y se sincronice entre tus dispositivos.</li>
          <li>Mostrarte tu propio progreso y tus resultados.</li>
          <li>Darte soporte cuando nos escribís.</li>
          <li>Mejorar el producto, usando información agregada y sin identificarte.</li>
          <li>Cumplir obligaciones legales.</li>
        </ul>
        <p>No usamos tus datos para publicidad y no los vendemos.</p>
      </section>
      <section>
        <h2>4. Quién puede ver tus datos</h2>
        <ul>
          <li><strong>Vos:</strong> lo que escribís en el Registro Diario, Mis notas y demás secciones está asociado a tu cuenta y solo vos lo ves desde la app.</li>
          <li><strong>Nosotros:</strong> quien administra el producto tiene acceso técnico a los datos de las cuentas, incluidos los textos que escribís. Para el seguimiento general usamos tu email, tu compra, tu progreso y métricas de uso (por ejemplo, qué módulos completaste y cuántos días registraste). Solo accedemos al contenido de tus textos personales cuando es necesario para darte el soporte que nos pedís, para resolver un problema técnico o para cumplir una obligación legal.</li>
          <li><strong>Proveedores tecnológicos:</strong> usamos servicios de terceros para alojar la app y la base de datos y para enviar los emails de acceso. Solo acceden a los datos necesarios para prestar su servicio.</li>
          <li><strong>Autoridades:</strong> solo si una ley o una orden judicial nos lo exige.</li>
        </ul>
      </section>
      <section>
        <h2>5. Dónde se guardan tus datos</h2>
        <p>Tus datos se alojan en servidores de proveedores tecnológicos, que pueden estar fuera de tu país. Usamos proveedores que aplican medidas de seguridad adecuadas.</p>
      </section>
      <section>
        <h2>6. Cuánto tiempo los conservamos</h2>
        <p>Conservamos tus datos mientras tu cuenta esté activa. Si pedís que eliminemos tu cuenta o tus datos, los borramos dentro de los 30 días, salvo los que debamos conservar por obligación legal (por ejemplo, registros de compra). Si solicitás un reembolso, tu cuenta se da de baja y, si además querés que borremos tus datos personales, podés pedirlo por email.</p>
      </section>
      <section>
        <h2>7. Tus derechos</h2>
        <p>Podés pedirnos:</p>
        <ul>
          <li>acceder a los datos que tenemos sobre vos;</li>
          <li>corregirlos;</li>
          <li>eliminarlos, incluida tu cuenta;</li>
          <li>recibir una copia de tus datos;</li>
          <li>oponerte a determinado uso de tus datos.</li>
        </ul>
        <p>Para ejercerlos, escribinos a <Email /> desde el email con el que accedés. Te respondemos en un plazo máximo de 10 días hábiles.</p>
        <p>La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos de quienes resulten afectados en sus derechos por el incumplimiento de las normas de protección de datos personales.</p>
      </section>
      <section>
        <h2>8. Seguridad</h2>
        <p>Protegemos tus datos con medidas técnicas razonables: conexiones cifradas, acceso a tu cuenta con tu email y controles para que cada persona acceda solo a sus propios datos desde la app. Ninguna medida es infalible, pero trabajamos para reducir los riesgos.</p>
      </section>
      <section>
        <h2>9. Cookies y almacenamiento local</h2>
        <p>Usamos solo lo necesario para que la app funcione: mantener tu sesión iniciada, recordar tus preferencias (como el modo claro u oscuro) y guardar borradores. No usamos cookies de publicidad ni herramientas de analítica de terceros.</p>
      </section>
      <section>
        <h2>10. Menores de edad</h2>
        <p>Neurohack 21 está dirigido a personas mayores de 18 años. No recopilamos datos de menores de forma intencional.</p>
      </section>
      <section>
        <h2>11. Cambios en esta política</h2>
        <p>Si cambiamos esta política, actualizamos la fecha de arriba y, si el cambio es importante, te lo avisamos por email o dentro de la app.</p>
      </section>
      <section>
        <h2>12. Contacto</h2>
        <p>Para cualquier consulta sobre tus datos, escribinos a <Email />.</p>
      </section>
    </LegalPage>
  );
}
