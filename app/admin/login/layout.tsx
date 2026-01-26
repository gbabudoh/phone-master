export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout removes the main site header/footer for admin login
  return <>{children}</>;
}
