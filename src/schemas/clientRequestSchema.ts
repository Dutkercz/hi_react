import z from "zod";
import { addressCreateSchema } from "./addressRequestSchema";

export const registerClientSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(3, "O campo nome deve conter ao menos 3 caracteres")
        .max(30, "O campo nome de conter no máximo 30 caracteres"),
    lastName: z
        .string()
        .trim()
        .min(3, "O campo nome deve conter ao menos 3 caracteres")
        .max(30, "O campo nome de conter no máximo 30 caracteres"),
    cpf: z
        .string()
        .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF fora do formato esperado")
        .transform((val) => val.replace(/[.-]/g, "")),
    cnpj: z.string()
        .trim()
        .regex(
        /^[A-Za-z0-9]{2}\.?[A-Za-z0-9]{3}\.?[A-Za-z0-9]{3}\/?[A-Za-z0-9]{4}-?[A-Za-z0-9]{2}$/, 
        "CNPJ fora do formato esperado"
        )
        .transform((val) => val.replace(/[.\-/]/g, ""))
        .refine((val) => val.length === 14, "O CNPJ deve ter exatamente 14 caracteres")
        .optional(),
    phoneNumber: z
        .string()
        .transform((val) => val.replace(/[()\-_ ]/g, ""))
        .pipe(z.string().min(10, "Telefone muito curto").max(14, "Telefone muito longo")),
    addresses: z.array(addressCreateSchema,).min(1)
})

export type RegisterClientSchema = z.infer<typeof registerClientSchema>