"use client";

import { useSessionData } from "../hooks/useSession";

export default function Profile() {
  const { user, accessToken } = useSessionData();

  if (!user || !accessToken) return <div>No autenticado</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>ID: {user.id}</p>
      {/* El token solo debería mostrarse en desarrollo */}
      {process.env.NODE_ENV === "development" && (
        <details>
          <summary>Token (solo desarrollo)</summary>
          <code>{accessToken}</code>
        </details>
      )}
    </div>
  );
}
