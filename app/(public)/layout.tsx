import Headers from "@/components/ui/Headers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <>
    <Headers />
    {children}

    <footer className="font-black text-center p-5" >
      <p>Derechos Reservados Meeti {new Date().getFullYear()} &copy;</p>
    </footer>
   </>
  );
}