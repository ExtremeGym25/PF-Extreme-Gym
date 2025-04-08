"use client";

import { AuthProvider } from "./contextos/contextoAuth";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer, Bounce } from "react-toastify";
import Navbar from "./components/navbarFooter/navbar";
import Footer from "./components/navbarFooter/footer";
import VisibleWrapper from "./wrapper/visibleWrapper";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";
import { ImageProvider } from "@/app/contextos/contextoImag";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ImageProvider>
      <SessionProvider>
        <Providers>
          <AuthProvider>
            <Elements stripe={stripePromise}>
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
                theme="light"
                transition={Bounce}
                toastClassName="custom-toast"
              />
            </Elements>
          </AuthProvider>
        </Providers>
      </SessionProvider>
    </ImageProvider>
  );
}
