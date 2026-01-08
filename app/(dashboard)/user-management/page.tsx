import { updateProfile } from "@/app/actions/user"
import { ChangePasswordForm } from "@/components/change-password"
import { ToggleOtpForm } from "@/components/toggle-otp-form"
import { UpdateProfileForm } from "@/components/update-profile"
import { auth } from "@/lib/auth"
import { authIsRequired, authSession } from "@/lib/auth-utils"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function UserManagementPage() {
    await authIsRequired()
    const { users } = await auth.api.listUsers({
        query: {},
        headers: await headers()
    })
    const session = await authSession()

    const hasDeletePermission = await auth.api.userHasPermission({
        body: {
            userId: session?.user.id,
            permission: {
                user: ['delete']
            }
        },
    })

    const formattedUsers = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        hasDeletePermission: hasDeletePermission.success
    })).filter((f) => ["user", "admin"].includes(f.role as string))

    if (!users) {
        redirect("/sign-in")
    }
    return (
        <div className="w-full p-6 shadow-lg mx-auto max-w-7xl min-h-dvh rounded-2xl h-full flex gap-6 items-start">


        </div>
    )
}