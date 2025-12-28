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


interface ToggleOtpFormProps {
    twoFactorEnabled?: boolean;
}
const formSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters."),
})

export function ToggleOtpForm({ twoFactorEnabled }: ToggleOtpFormProps) {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
    })

    const [isOpen, setIsOpen] = React.useState(false)

    const handleChange = () => {
        setIsOpen(true)
    }

    const onSubmit = async ({ password }: z.infer<typeof formSchema>) => {
        try {
            if (twoFactorEnabled) {
                const { error } = await authClient.twoFactor.disable({ password })
                if (error) {
                    toast.error(error.message)
                    return
                }
                router.refresh()
                toast.success("Two factor authentication disabled.")

            } else {
                const { error } = await authClient.twoFactor.enable({ password })
                if (error) {
                    toast.error(error.message)
                    return
                }
                router.refresh()
                toast.success("Two factor authentication enabled.")
            }
        } catch {
            throw new Error("Failed to toggle two factor authentication.")
        } finally {
            setIsOpen(false)
        }
    }



    return (
        <Card className="w-full max-w-md border-0 shadow-none">
            <CardHeader>
                <CardTitle>Enable/Disable 2FA</CardTitle>
                <CardDescription>
                    Enable/Disable 2FA in your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                    <Label>{!twoFactorEnabled
                        ? "Enable two factor authentication"
                        : "Disable two factor authentication"}</Label>
                    <Switch checked={twoFactorEnabled} onCheckedChange={handleChange} />
                </div>
                <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {!twoFactorEnabled ? "Enable Two Factor Authentication" : "Disable Two Factor Authentication"}
                            </DialogTitle>
                            <DialogDescription>
                                Please confirm your password to {" "}
                                {!twoFactorEnabled ? "enable" : "disable"} 2FA in your account.
                            </DialogDescription>
                        </DialogHeader>
                        <form id="toggle-otp-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                            <FieldGroup>
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

                            </FieldGroup>
                            <Button type="submit" form="toggle-otp-form" disabled={form.formState.isSubmitting} className="max-w-40 self-end cursor-pointer">
                                {
                                    form.formState.isSubmitting ? (
                                        <Spinner className="size-6" />
                                    ) : (
                                        !twoFactorEnabled ? ("Enable 2FA") : ("Disable 2FA")
                                    )
                                }
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}
