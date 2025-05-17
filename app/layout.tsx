// ...your imports

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="w-full text-center text-xs text-gray-500 py-2 border-t mt-6">
          Internel usage only. Copyright@Mizzima2025
        </footer>
      </body>
    </html>
  );
}
