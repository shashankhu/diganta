import "./globals.css";

export const metadata = {
  title: "DIGANTA — College Event Management System",
  description:
    "From idea to execution to legacy — the complete college event lifecycle platform",
  keywords: ["college", "event management", "diganta", "approval workflow"],
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
