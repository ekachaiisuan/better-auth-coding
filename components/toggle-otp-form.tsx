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

interface ToggleOtpFormProps {
    twoFactorEnabled?: boolean;
}
const formSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters."),
})

export function ToggleOtpForm({ twoFactorEnabled }: ToggleOtpFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await authClient.updateUser({
                name: data.name,
                image: data.image,
            },
                {
                    onSuccess: () => {
                        toast.success("Updated successfully.")
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message)
                    }
                })
        } catch (error) {
            throw new Error("Failed to update profile.")
        }
    }



    return (
        <Card className="w-full max-w-md border-0 shadow-none">
            <CardHeader>
                <CardTitle>Update your details</CardTitle>
                <CardDescription>
                    Update your details.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="update-profile" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Name
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
                                        disabled
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="image"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Image
                                    </FieldLabel>
                                    <ImageUpload
                                        defaultUrl={field.value}
                                        onChange={(url) => field.onChange(url)}
                                        endpoint="imageUploader"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <Button type="submit" form="update-profile" disabled={form.formState.isSubmitting} className="max-w-40 self-end cursor-pointer">
                        {
                            form.formState.isSubmitting ? (
                                <Spinner className="size-6" />
                            ) : (
                                "Update Profile"
                            )
                        }
                    </Button>
                </form>
            </CardContent>

        </Card>
    )
}
