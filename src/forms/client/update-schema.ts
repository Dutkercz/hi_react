import z from "zod";

export const updateClientSchema = z.object({
    id: z.number().nonoptional(),
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
    phoneNumber: z
        .string()
        .transform((val) => val.replace(/[()\-_ ]/g, ""))
        .pipe(z.string().min(10, "Telefone muito curto").max(14, "Telefone muito longo"))
})

export type UpdateClientSchema = z.infer<typeof updateClientSchema>