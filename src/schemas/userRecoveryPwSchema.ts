import z from "zod";

export const userRecoveryPwSchema = z.object({
    otpCode: z.string().trim().nonoptional(),
    password: z.string().trim()
        //.regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{6,100}$/, "Siga o padrão AZ-az 0-9 com caracteres especiais")
        .regex(/[A-Z]/, "Ao menos 1 letra maiúscula")
        .regex(/[a-z]/, "Ao menos 1 letra minúscula")
        .regex(/\d/, "Ao menos 1 digito")
        .regex(/^.{6,100}$/, "Ao menos 6 caracteres"),
    confirmpw: z.string().trim()
})
.refine((data) => data.password === data.confirmpw, 
{message: "Você deve repetir a mesma senha", path: ['confirmpw']})

export type userRecoveryPwSchema = z.infer<typeof userRecoveryPwSchema>