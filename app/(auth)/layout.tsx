export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div className="w-full flex h-dvh items-center justify-center">{children}</div>
}