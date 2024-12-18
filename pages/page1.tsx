import { getSession } from "next-auth/react";
import React from "react";

export const getServerSideProps = async ({ req, res, locale }) => {
  const session = await getSession({ req });
  const user = session?.user;
  if (!user) {
    console.log("Page-1, No user, redirecting to login");
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
  const accessToken = session?.accessToken;
  // get the issuer, subject, and expiration time from the access token
  const tokenParts = accessToken.split(".");
  const tokenDecoded = JSON.parse(
    Buffer.from(tokenParts[1], "base64").toString()
  );
  const { iss, sub, exp } = tokenDecoded;
  const expDate = new Date(exp * 1000).toLocaleString();
  console.log("iss: ", iss);
  console.log("sub: ", sub);
  console.log("exp: ", exp);
  return (
    <div>
      <h3>Next12 With NextAuth</h3>
      <h1>Page-1</h1>
      <div>
        <h4>Access Token</h4>
        <div>
          <ul>
            <li>
              <strong>iss</strong>: {iss}
            </li>
            <li>
              <strong>sub</strong>: {sub}
            </li>
            <li>
              <strong>exp</strong>: {expDate}
            </li>
          </ul>
        </div>
      </div>
      <div>
        <h4>Session</h4>
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
