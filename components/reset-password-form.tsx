"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Spinner } from "./ui/spinner"
import { Separator } from "@/components/ui/separator"
import ImageUpload from "@/components/image-upload"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter, useSearchParams } from "next/navigation"

const formSchema = z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
    confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
})

export function ResetPasswordForm() {
    const router = useRouter()
    const params = useSearchParams()
    const token = params.get("token")
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmNewPassword: "",
        },
    })


    const onSubmit = async ({ newPassword, confirmNewPassword }: z.infer<typeof formSchema>) => {
        try {

            await authClient.resetPassword({ newPassword: newPassword, token: token as string }, {
                onSuccess: async () => {
                    router.push("/")
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message)
                }
            })
        } catch (error) {
            throw new Error("Something went wrong")
        }
    }



    return (

        <Card className="w-full max-w-md min-w-sm">
            <CardContent>
                <form id="reset-password" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <FieldGroup>
                        <Controller
                            name="newPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        aria-invalid={fieldState.invalid}
                                        type="password"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="confirmNewPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Confirm Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        aria-invalid={fieldState.invalid}
                                        type="password"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                    </FieldGroup>
                    <Button type="submit" form="reset-password" disabled={form.formState.isSubmitting} className="max-w-40 self-end cursor-pointer">
                        {
                            form.formState.isSubmitting ? (
                                <Spinner className="size-6" />
                            ) : (
                                "Reset Password"
                            )
                        }
                    </Button>
                </form>

            </CardContent>
        </Card>

    )
}
