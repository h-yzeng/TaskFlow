import "../styles/globals.css";
import NavBar from "../components/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen antialiased">
        <NavBar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
