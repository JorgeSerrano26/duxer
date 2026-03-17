# Mejoras sugeridas – DUXER Landing Page

## UX / Experiencia de Usuario

1. **Galería de productos con lightbox** — Actualmente los productos usan placeholders. Agregar imágenes reales con un lightbox de zoom mejoraría el engagement y la tasa de solicitudes.

2. **Chat en vivo o widget de WhatsApp expandido** — El botón de WhatsApp flotante es efectivo, pero un widget expandible con un mensaje pre-escrito y nombre del agente aumenta las conversiones en ~30% según benchmarks del sector.

3. **Sección de testimonios** — Agregar reseñas de clientes (ej. hoteles o clubes usando el equipo) con foto, nombre y empresa genera confianza y reduce la fricción de compra B2B.

4. **Video de fondo en el Hero** — Un video corto (10-15 seg, sin audio, loop) de la maquinaria en operación sería más impactante que una imagen estática. Implementar con `<video autoplay muted loop playsinline>`.

5. **Calculadora de ROI o cotizador rápido** — Una herramienta interactiva donde el usuario ingresa capacidad requerida (kg/día) y recibe una recomendación de equipo. Esto califica leads antes de que lleguen al formulario.

6. **Indicador de progreso en el formulario** — Agregar validación en tiempo real (a medida que el usuario escribe) reduce los abandonos del formulario vs. errores solo al submit.

7. **Scroll to top button** — Para páginas largas con mucho contenido, facilitar el regreso al inicio mejora la navegación.

---

## Mejoras Técnicas

1. **Imágenes reales optimizadas** — Reemplazar `via.placeholder.com` por imágenes WebP reales con `srcset` y `sizes` para responsive. Usar `<Image>` de Astro para optimización automática.

2. **SSG / ISR para la landing** — La página principal no necesita SSR. Cambiar a `output: 'static'` con `output: 'hybrid'` (prerender: true en index) y servir desde CDN (Cloudflare, Netlify, Vercel) para cargas sub-segundo.

3. **Redis para rate limiting** — El rate limiter actual es in-memory, por lo que no funciona correctamente con múltiples instancias. Migrar a Upstash Redis con `@upstash/ratelimit` para entornos de producción con escalamiento horizontal.

4. **Email de confirmación al usuario** — Enviar un email automático al lead confirmando la recepción de su consulta. Mejora la percepción profesional y reduce consultas duplicadas.

5. **Analytics de conversión** — Integrar Google Analytics 4 o Plausible con eventos personalizados: `form_submit`, `cta_click`, `whatsapp_click` para medir el funnel de conversión.

6. **Sitemap XML + robots.txt** — Agregar `@astrojs/sitemap` para SEO técnico y asegurar que los motores de búsqueda indexen correctamente.

7. **CSP (Content Security Policy)** — Agregar headers de seguridad mediante middleware de Astro o en el servidor/CDN. Especialmente importante para el formulario de contacto.

8. **Error boundary y fallbacks** — El formulario debería manejar gracefully el caso donde reCAPTCHA no carga (adblockers, redes restringidas).

---

## Mejoras de Conversión

1. **CTA secundario en el Hero** — Agregar un número de teléfono o WhatsApp directo visible en el hero para usuarios que prefieren contacto inmediato sobre completar un formulario.

2. **Social proof en el formulario** — Agregar un pequeño testimonial o estadística ("Respondemos en menos de 24hs") cerca del botón de envío reduce el abandono del formulario.

3. **Urgencia/escasez** — Si aplicable al negocio, agregar mensajes como "Stock limitado para entrega en [mes]" o "Instalaciones programadas para [trimestre]" crea urgencia sin ser engañoso.

4. **Sección FAQ** — Preguntas frecuentes sobre garantía, instalación, financiamiento y servicio post-venta reducen la fricción de decisión en clientes B2B con largos ciclos de compra.

5. **Badge de garantía en el hero** — Mostrar el badge "Garantía 2 años" cerca del CTA principal, no solo en su sección específica. Los buyers B2B valoran ver garantías desde el primer contacto.

6. **CTA flotante en mobile** — En dispositivos móviles, agregar un bar fijo en la parte inferior con "Llamar" y "WhatsApp" aumenta dramáticamente las conversiones mobile.
