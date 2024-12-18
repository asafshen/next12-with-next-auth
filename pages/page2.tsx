import { getSession } from "next-auth/react";
import React from "react";

export const getServerSideProps = async ({ req, res, locale }) => {
  const session = await getSession({ req });
  const user = session?.user;
  if (!user) {
    console.log("Page2, No user, redirecting to login");
    return {
      redirect: {
        permanent: false,
        destination: "/api/auth/signin",
      },
    };
  }
  return { props: { session } };
};

export default function Page({ session }) {
  return (
    <div>
       <h3>Next12 With NextAuth</h3>
       <h1>Page 2</h1>
      <div>
        <ul>
          {Object.entries(session).map(([key, value]) => (
            <li key={key}>
              <strong>{key}</strong>: {JSON.stringify(value, null, 2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
