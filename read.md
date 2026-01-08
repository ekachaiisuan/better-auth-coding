user-management
--page.ts
<UserManagementForm users={formattedUsers} /> // error code endline
--user-client.tsx
<DataTable data={users} /> // error code endline
const ROLE_OPTIONS = ["user", "admin","superadmin"] as const;
await authClient.admin.createUser({
                    name: values.name,
                    email: values.email,
                    role: values.role as Role, // error code
                    password: values.password as string
                })
