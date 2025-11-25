export const metadata = {
  title: "Cosmo UI - AR Demo",
  description: "AI-first cross-reality UI framework - AR example",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
