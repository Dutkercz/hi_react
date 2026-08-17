import z from "zod";
import { addressCreateSchema } from "../address/address-schema";

export const registerClinetSchema = z.object({
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
        .regex(/^\d{3}.?\d{3}.?\d{3}-?\d{2}$/, "CPF fora do formato esperado"),
    cnpj: z
        .string()
        .regex(/^\d{2}.?\d{3}.?\d{3}-?\d{4}\/?\d{2} ?$/, "CNPJ fora do formato esperado")
        .or(z.literal(""))
        .optional(),
    phoneNumber: z
        .string()
        .trim()
        .min(10)
        .max(14),
    addresses: z.array(addressCreateSchema,).min(1)
})

export type RegisterClientSchema = z.infer<typeof registerClinetSchema>