import { UserProps } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { z } from "zod"

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email("Invalid email"),
    role: z.enum(["user", "admin", "superadmin"], 'Invalid role'),
    password: z.string().min(6, "Password must be at least 6 characters long").optional(),

})

export default function UserManagementClient({ users }: { users: UserProps }) {

    return (
        <>
            <Dialog>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{!!users.id ? "Edit" : "Create"} User</DialogTitle>
                        <DialogDescription>
                            Update user information
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )

}