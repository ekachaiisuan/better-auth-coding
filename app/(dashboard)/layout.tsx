

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-w-dvw min-h-dvh bg-white">
      {children}
    </div>
  );
}
