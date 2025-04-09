// "use client";

// import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
// import { ReactNode } from "react";

// export const Auth0ProviderWrapper = ({ children }: { children: ReactNode }) => {
//   return (
//     <Auth0Provider
//       domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
//       clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
//       authorizationParams={{
//         redirect_uri: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL!,
//       }}
//     >
//       {children}
//     </Auth0Provider>
//   );
// };

// export const useAuth0Context = () => {
//   const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

//   return {
//     user,
//     isAuth: isAuthenticated,
//     login: loginWithRedirect,
//     logout: () =>
//       logout({ logoutParams: { returnTo: window.location.origin } }),
//   };
// };
