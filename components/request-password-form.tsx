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
    email: z.email("Invalid email"),
})

export function RequestPasswordForm() {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })
    const [isEmailSent, setIsEmailSent] = React.useState(false)

    const onSubmit = async ({ email }: z.infer<typeof formSchema>) => {
        try {

            const { data, error } = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" })
            if (data?.status) {
                toast.success('An email has been sent to you.')
                setIsEmailSent(true)
                router.refresh()
            }
            if (error) {
                toast.error(error.message)
                setIsEmailSent(false)
            }
        } catch (error) {
            toast.error("Failed to send request.")
        }
    }



    return (
        <>
            {isEmailSent ? (
                <Card className="w-full max-w-md min-w-sm">
                    <CardHeader>
                        <CardTitle>Check your email</CardTitle>
                        <CardContent>
                            <div className="flex w-full p-6">
                                A password reset email has been sent to your email.
                            </div>
                            <Button onClick={() => router.push("/sign-in")}>Back to Sign in</Button>
                        </CardContent>
                    </CardHeader>
                </Card>) : (
                <Card className="w-full max-w-md min-w-sm">
                    <CardContent>
                        <form id="request-password" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                            <FieldGroup>
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>
                                                Email
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                autoComplete="off"
                                                aria-invalid={fieldState.invalid}
                                                type="email"

                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                            </FieldGroup>
                            <Button type="submit" form="request-password" disabled={form.formState.isSubmitting} className="max-w-40 self-end cursor-pointer">
                                {
                                    form.formState.isSubmitting ? (
                                        <Spinner className="size-6" />
                                    ) : (
                                        "Send request"
                                    )
                                }
                            </Button>
                        </form>

                    </CardContent>
                </Card>)}
        </>
    )
}
