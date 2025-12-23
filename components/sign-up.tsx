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

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    email: z.email("Invalid email"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export function SignUpForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
            },
                {
                    onSuccess: () => {
                        toast.success("Signed up successfully.")
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message)
                    }
                })
        } catch (error) {
            throw new Error("Failed to sign up.")
        }
    }

    const signInWithGoogle = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            },
                {
                    onSuccess: () => {
                        toast.success("Signed in successfully.")
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message)
                    }
                })
        } catch (error) {
            throw new Error("Failed to sign in with Google.")
        }
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                    Sign up to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
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
                            name="confirmPassword"
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
                </form>
            </CardContent>
            <CardFooter className="flex-col w-full">
                <Field orientation="horizontal" className="flex w-full items-center justify-between flex-col gap-2">
                    <p className="text-sm flex items-center gap-1">
                        Already have an account?{ }
                        <Link href="/sign-in" className="text-blue-500">Sign In</Link>
                    </p>
                    <>
                        <Button type="submit" form="signup-form" className="w-full cursor-pointer">
                            {
                                form.formState.isSubmitting ? (
                                    <Spinner className="size-6" />
                                ) : (
                                    "Sign Up"
                                )
                            }
                        </Button>
                    </>
                </Field>

                <div className="flex w-full items-center my-6 justify-center flex-col gap-2">
                    <p className="text-sm">Or</p>
                    <Separator className="gap-3 my-1" />
                </div>
                <div className="flex flex-col w-full gap-3">
                    <Button
                        type="button"
                        className="text-sm cursor-pointer"
                        onClick={signInWithGoogle}
                    >
                        Sign up with Google
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
