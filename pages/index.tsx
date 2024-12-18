import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

export default () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div>
        <div>You are not signed in</div>
        <button
          className="bg-none border-gray-300 border py-2 px-6 rounded-md mb-2"
          onClick={() => signIn("descope")}
        >
          Sign in with Descope
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3>Next12 With NextAuth</h3>
      <h1>Home</h1>
      <div>{session && <p>Signed in as {session.user.email}</p>}</div>
      <div>
        <button
          className="bg-none border-gray-300 border py-2 px-6 rounded-md mb-2"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};
