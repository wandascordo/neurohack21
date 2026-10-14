import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { meta } from "@/components/Placeholder";

export const Route = createFileRoute("/terminos-de-uso")({
  head: () => meta("Términos de uso", "Condiciones de acceso, compra y uso de Neurohack 21, de Destello Interior."),
  component: Terms,
});

function Email() {
  return <a href="mailto:neurohack21@gmail.com">neurohack21@gmail.com</a>;
}

function Terms() {
  return (
    <LegalPage title="Términos de uso" updated="14 de octubre de 2026">
      <section>
        <h2>1. Quién ofrece este producto</h2>
        <p>Neurohack 21 es un libro interactivo y un conjunto de herramientas digitales ofrecido bajo la marca Destello Interior (“nosotros”). Al crear tu cuenta, acceder o usar Neurohack 21, aceptás estos Términos de uso y la <Link to="/politica-de-privacidad">Política de privacidad</Link>. Si no estás de acuerdo, por favor no uses el producto.</p>
      </section>
      <section>
        <h2>2. Qué incluye Neurohack 21</h2>
        <p>Incluye un libro interactivo de 8 módulos, un reto de 21 días y recursos de apoyo: Autoevaluación de Foco, Botón Anti-Distracción, Registro Diario, Tracker Visual de tu Progreso, Guiones y Glosario. Podemos mejorar, reorganizar o actualizar contenidos y funciones para que el producto siga siendo útil.</p>
      </section>
      <section>
        <h2>3. Tu cuenta y tu acceso</h2>
        <ul>
          <li>Accedés con el email que usaste en la compra. El acceso es personal e intransferible.</li>
          <li>No compartas tu cuenta ni tu acceso con otras personas.</li>
          <li>Sos responsable de mantener seguro tu email y tus datos de acceso. Si creés que alguien accedió sin tu permiso, escribinos a <Email />.</li>
          <li>Tenés que ser mayor de 18 años para usar el producto.</li>
        </ul>
      </section>
      <section>
        <h2>4. Compra, pago único, acceso y reembolsos</h2>
        <ul>
          <li>Neurohack 21 se adquiere con un pago único. No hay suscripción ni cargos recurrentes.</li>
          <li>El pago se procesa de forma externa y segura. Nosotros no vemos ni guardamos los datos de tu tarjeta.</li>
          <li>Tu acceso se mantiene mientras Neurohack 21 esté disponible. Si algún día dejáramos de ofrecerlo, te avisaremos con una anticipación razonable.</li>
          <li><strong>Reembolsos:</strong> podés solicitar el reembolso de tu compra hasta 30 días después de la fecha de compra. Para hacerlo, escribinos a <Email /> desde el email con el que compraste. Al procesar el reembolso damos de baja tu cuenta y tu acceso finaliza. Si además querés que eliminemos tus datos personales, pedínoslo y los borramos según la <Link to="/politica-de-privacidad">Política de privacidad</Link>. Esto no limita los derechos que la ley te reconoce como consumidor.</li>
        </ul>
      </section>
      <section>
        <h2>5. Propiedad intelectual</h2>
        <ul>
          <li>Los textos, diseños, ejercicios, gráficos, marcas y demás contenidos de Neurohack 21 pertenecen a Destello Interior y están protegidos por las leyes de propiedad intelectual.</li>
          <li>Te damos una licencia personal, limitada, no exclusiva e intransferible para usar el producto para tu propio desarrollo personal.</li>
          <li>No está permitido copiar, reproducir, distribuir, revender, publicar ni compartir el contenido, ni usarlo para crear otros productos, sin nuestro permiso por escrito. Podés imprimir o replicar los recursos para tu uso personal.</li>
        </ul>
      </section>
      <section>
        <h2>6. Tu contenido</h2>
        <p>Lo que escribís en el Registro Diario, Mis notas, tus intenciones, tu ritual mínimo y tus autoevaluaciones es tuyo. Nos das permiso únicamente para guardarlo y mostrártelo dentro de tu cuenta, y para los fines descritos en la <Link to="/politica-de-privacidad">Política de privacidad</Link>. Podés pedir que lo eliminemos según se explica en esa política.</p>
      </section>
      <section>
        <h2>7. Uso aceptable</h2>
        <p>Te comprometés a no usar el producto para:</p>
        <ul>
          <li>infringir derechos de terceros o las leyes aplicables;</li>
          <li>intentar acceder a cuentas, datos o sistemas que no son tuyos;</li>
          <li>alterar, copiar masivamente (por ejemplo, con programas automáticos) o interferir con el funcionamiento de la app;</li>
          <li>compartir tu acceso para que otras personas usen el producto sin haberlo adquirido.</li>
        </ul>
      </section>
      <section>
        <h2>8. Aviso importante sobre salud</h2>
        <p>Neurohack 21 es una herramienta educativa y de autoobservación. No es un servicio médico, psicológico ni terapéutico, y no reemplaza el diagnóstico, el tratamiento ni el consejo de un profesional de la salud. La Autoevaluación de Foco no es un test clínico ni un diagnóstico.</p>
        <ul>
          <li>Si tenés una condición de salud, estás en tratamiento o tenés dudas sobre si algún ejercicio es adecuado para vos, consultá antes con un profesional.</li>
          <li>Los ejercicios de respiración, escaneo corporal y visualización son suaves. Si sentís mareo, malestar o incomodidad, detenete.</li>
          <li>Si atravesás un momento de crisis emocional, buscá ayuda profesional o los servicios de emergencia de tu país. Este producto no está pensado para esas situaciones.</li>
        </ul>
      </section>
      <section>
        <h2>9. Disponibilidad del servicio</h2>
        <p>Hacemos lo posible para que la app funcione de forma continua, pero no garantizamos que esté siempre disponible ni libre de errores. Puede haber interrupciones por mantenimiento, actualizaciones o causas ajenas a nosotros.</p>
      </section>
      <section>
        <h2>10. Limitación de responsabilidad</h2>
        <p>En la medida permitida por la ley aplicable, no somos responsables por daños indirectos o por resultados que dependan de tu uso personal del producto. No prometemos resultados específicos: lo que cambia en tu foco depende de tu práctica y de tu situación. Nada en estos términos limita los derechos que la ley te reconoce como consumidor.</p>
      </section>
      <section>
        <h2>11. Suspensión o cierre de la cuenta</h2>
        <p>Podemos suspender o cerrar una cuenta si se incumplen estos términos, por ejemplo si se comparte el acceso o se copia el contenido. Antes te vamos a avisar, salvo que haya un riesgo para el servicio o para otras personas. Si querés eliminar tu cuenta, escribinos a <Email /> desde el email con el que accedés.</p>
      </section>
      <section>
        <h2>12. Cambios en estos términos</h2>
        <p>Podemos actualizar estos términos. Si el cambio es importante, te lo vamos a avisar por email o dentro de la app. Seguir usando el producto después del cambio implica que lo aceptás.</p>
      </section>
      <section>
        <h2>13. Ley aplicable</h2>
        <p>Estos términos se rigen por las leyes de la República Argentina. Para cualquier controversia serán competentes los tribunales ordinarios de la República Argentina, sin perjuicio de lo que la ley establezca a favor de los consumidores.</p>
      </section>
      <section>
        <h2>14. Contacto</h2>
        <p>Para consultas sobre estos términos, escribinos a <Email />.</p>
      </section>
    </LegalPage>
  );
}