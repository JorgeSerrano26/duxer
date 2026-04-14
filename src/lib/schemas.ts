import { z } from 'zod';

export const contactSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Ingresa un email válido'),
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  company: z
    .string()
    .max(150, 'El nombre de la compañía es demasiado largo')
    .optional(),
  message: z
    .string()
    .min(1, 'El mensaje es requerido')
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(200, 'El mensaje no puede superar los 200 caracteres'),
  recaptchaToken: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
