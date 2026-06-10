import "./globals.css";

export const metadata = {
  title: "IA-Matcher | Sistema Inteligente de Selección",
  description:
    "Automatiza el análisis de CVs y elimina el sesgo humano con IA.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full text-slate-800 antialiased font-sans">{children}</body>
    </html>
  );
}
