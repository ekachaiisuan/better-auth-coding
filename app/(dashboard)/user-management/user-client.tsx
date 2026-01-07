'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useUsers, UserProps } from "@/hooks/use-user"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const ROLE_OPTIONS = ['user', 'admin'] as const

export type Role = (typeof ROLE_OPTIONS)[number]

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email("Email is required"),
    role: z.enum(ROLE_OPTIONS, 'Role is required'),
    password: z.string().min(6, "Password must be at least 6 characters long").optional(),
})

export default function UserManagementClient({ users }: { users: UserProps }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            role: undefined
        },
    })
    const { user, setUser, isOpen, setIsOpen } = useUsers()
    useEffect(() => {
        if (user) {
            form.setValue("name", user.name)
            form.setValue("email", user.email)
            const role = ROLE_OPTIONS.find((role) => role === user.role)
            if (role) {
                form.setValue("role", role)
            } else {
                form.setValue("role", "user")
            }
        }
    }, [user, form])
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!user.id) {
            await authClient.admin.createUser({
                name: values.name,
                email: values.email,
                role: values.role as Role,
                password: values.password as string
            })
        } else {

        }
        setIsOpen(false)
    }
    return (
        <>
            <Dialog>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{!!users.id ? "Edit" : "Create"} User</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        id="user-management"
                        className="flex flex-col items-end justify-center"
                    >
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel>Name</FieldLabel>
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
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel>Email</FieldLabel>
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

                            {!user.id ? (
                                <Controller
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid} className="gap-1">
                                            <FieldLabel>Password</FieldLabel>
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
                            ) : null}

                            <Controller
                                name="role"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-1">
                                        <FieldLabel>Role</FieldLabel>
                                        <Select
                                            {...field}
                                            onValueChange={field.onChange}
                                            defaultValue={user.role}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ROLE_OPTIONS.map((role) => (
                                                    <SelectItem key={role} value={role}>
                                                        {role}{" "}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <Button
                            type="submit"
                            className="cursor-pointer max-w-40 self-end my-6"
                            disabled={form.formState.isSubmitting}
                            form="user-management"
                        >
                            {form.formState.isSubmitting ? (
                                <Spinner className="size-6" />
                            ) : (
                                "Save changes"
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )

}