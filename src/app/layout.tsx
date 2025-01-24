import type { Metadata } from "next";
import { auth } from "@/auth";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Providers } from "@/components/Providers";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

export const metadata: Metadata = {
  title: "JCB",
  description: "JCB",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CurrencyProvider>
          <Providers>
            <ClientLayout session={session}>{children}</ClientLayout>
          </Providers>
        </CurrencyProvider>
      </body>
    </html>
  );
}
