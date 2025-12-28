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
import { useRouter } from "next/navigation"

const formSchema = z.object({
    code: z.string().min(6, "Invalid code"),
})

export function OtpCodeForm() {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
        },
    })

    const onSubmit = async ({ code }: z.infer<typeof formSchema>) => {
        try {
            const { error } = await authClient.twoFactor.verifyOtp({ code }, {
                onSuccess: async () => {
                    router.push("/")
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message)
                }
            })
        } catch (error) {
            toast.error("Invalid code.")
        }
    }



    return (
        <Card className="w-full max-w-md min-w-sm">
            <CardHeader>
                <CardTitle>Enter your otp code</CardTitle>
                <CardDescription>
                    Enter the otp code sent to your email.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="otp-code" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <FieldGroup>
                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Code
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        aria-invalid={fieldState.invalid}

                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                    </FieldGroup>
                    <Button type="submit" form="otp-code" disabled={form.formState.isSubmitting} className="max-w-40 self-end cursor-pointer">
                        {
                            form.formState.isSubmitting ? (
                                <Spinner className="size-6" />
                            ) : (
                                "Verify"
                            )
                        }
                    </Button>
                </form>

            </CardContent>
        </Card>
    )
}
