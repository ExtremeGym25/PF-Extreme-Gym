import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "../app/styles/globals.css";
import { Bounce, ToastContainer } from "react-toastify";
import Navbar from "./components/navbarFooter/navbar";
import Footer from "./components/navbarFooter/footer";
import { AuthProvider } from "./contextos/contextoAuth";
import VisibleWrapper from "./wrapper/visibleWrapper";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
}) as unknown as { variable: string };

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {" "}
        <AuthProvider>
          <VisibleWrapper>
            <Navbar />
          </VisibleWrapper>
          <div>{children}</div>
          <VisibleWrapper>
            <Footer />
          </VisibleWrapper>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
