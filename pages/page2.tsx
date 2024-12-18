import { getSession } from "next-auth/react";
import React from "react";

export const getServerSideProps = (async ({
  req,
  res,
  locale,
}) => {
  const session = await getSession({ req });  
  const user = session?.user;
  if (!user) {
    console.log('Page2, No user, redirecting to login');
    return {
      redirect: {
        permanent: false,
        destination: "/api/auth/signin",
      }
    };
  }
  return { props: { session } }
})

export default function Page ({
  session,
}) {
  return (
    <div>
      <h1>Next12 With NextAuth</h1>
      <div>Page 2</div>
      <div>
        {
          Object.entries(session).map(([key, value]) => (
            <div key={key}>
              <strong>{key}</strong>: {JSON.stringify(value, null, 2)}
            </div>
          ))
        }
      </div>
    </div>
  );
};
