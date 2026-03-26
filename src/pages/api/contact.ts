import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { contactSchema } from '../../lib/schemas';
import { rateLimit } from '../../lib/rateLimit';

export const prerender = false;

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = import.meta.env.RECAPTCHA_SECRET_KEY;
  if (!secret || !token) return true; // Skip verification if not configured

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = (await res.json()) as { success: boolean; score?: number };
    return data.success && (data.score === undefined || data.score >= 0.5);
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress ?? request.headers.get('x-forwarded-for') ?? 'unknown';

  // Rate limiting
  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Demasiadas solicitudes. Por favor intenta de nuevo en unos minutos.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  // Parse body
  let body: unknown;
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const fd = await request.formData();
      body = Object.fromEntries(fd.entries());
    }
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: 'Solicitud inválida.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Validate with Zod
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? '_';
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return new Response(
      JSON.stringify({ success: false, errors }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { email, name, company, message, recaptchaToken } = parsed.data;

  // Verify reCAPTCHA
  if (recaptchaToken) {
    const valid = await verifyRecaptcha(recaptchaToken);
    if (!valid) {
      return new Response(
        JSON.stringify({ success: false, message: 'Verificación de seguridad fallida. Intenta de nuevo.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Send email via Resend
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured — email not sent');
    return new Response(
      JSON.stringify({ success: true, message: 'Mensaje recibido correctamente.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const resend = new Resend(apiKey);
  const fromEmail = import.meta.env.RESEND_FROM_EMAIL ?? 'noreply@duxer.com.ar';
  const toEmail = import.meta.env.RESEND_TO_EMAIL ?? 'info@duxer.com.ar';

  try {
    await resend.emails.send({
      from: `DUXER Web <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,
      subject: `Nueva consulta web – ${name}`,
      html: `
        <div style="font-family:sans-serif; max-width:600px; margin:0 auto; padding:2rem; background:#f9f9f9;">
          <div style="background:#080808; padding:1.5rem 2rem; margin-bottom:1.5rem;">
            <h1 style="font-family:sans-serif; font-size:1.25rem; font-weight:900; color:white; letter-spacing:0.1em; text-transform:uppercase; margin:0;">
              DUXER <span style="color:#c8a86b;">·</span> Nueva consulta web
            </h1>
          </div>
          <div style="background:white; padding:2rem; border:1px solid #e5e4df;">
            <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
              <tr style="border-bottom:1px solid #f0efea;">
                <td style="padding:0.75rem 0; color:#888; width:130px; font-weight:500;">Nombre</td>
                <td style="padding:0.75rem 0; color:#111;">${name}</td>
              </tr>
              <tr style="border-bottom:1px solid #f0efea;">
                <td style="padding:0.75rem 0; color:#888; font-weight:500;">Email</td>
                <td style="padding:0.75rem 0;"><a href="mailto:${email}" style="color:#c8a86b;">${email}</a></td>
              </tr>
              ${company ? `
              <tr style="border-bottom:1px solid #f0efea;">
                <td style="padding:0.75rem 0; color:#888; font-weight:500;">Compañía</td>
                <td style="padding:0.75rem 0; color:#111;">${company}</td>
              </tr>` : ''}
              <tr>
                <td style="padding:0.75rem 0; color:#888; font-weight:500; vertical-align:top;">Mensaje</td>
                <td style="padding:0.75rem 0; color:#111; line-height:1.7; white-space:pre-wrap;">${message}</td>
              </tr>
            </table>
          </div>
          <p style="font-size:0.75rem; color:#aaa; margin-top:1.5rem; text-align:center;">
            Enviado desde duxer.com.ar · ${new Date().toLocaleString('es-MX', { timeZone: 'America/Cancun' })}
          </p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, message: '¡Mensaje enviado! Te contactaremos a la brevedad.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Resend error:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Error al enviar el mensaje. Inténtalo de nuevo.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
