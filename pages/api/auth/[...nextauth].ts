import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

// const DESCOPE_PROJECT_ID = 'P2My9KRakUMj40L8KOBjAJLVWhWC';
const DESCOPE_PROJECT_ID = process.env.DESCOPE_PROJECT_ID;
const DESCOPE_ACCESS_KEY = process.env.DESCOPE_ACCESS_KEY;


console.log('0 - DESCOPE_PROJECT_ID: ', DESCOPE_PROJECT_ID);
// print the first and last 3 characters of the DESCOPE_ACCESS_KEY
console.log('0 - DESCOPE_ACCESS_KEY: ', DESCOPE_ACCESS_KEY.slice(0, 3) + '...' + DESCOPE_ACCESS_KEY.slice(-3));

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'descope',
      name: 'Descope',
      type: 'oauth',
      wellKnown: `https://api.descope.com/${DESCOPE_PROJECT_ID}/.well-known/openid-configuration`,
      authorization: {
        params: { scope: 'openid email profile descope.custom_claims' },
      },
      idToken: true,
      clientId: DESCOPE_PROJECT_ID,
      clientSecret: DESCOPE_ACCESS_KEY,
      checks: ['pkce', 'state'],
      profile(profile, tokens) {
        return {
          id: profile.email,
          _id: profile.email,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          idToken: tokens.id_token,
          accessToken: tokens.access_token,
          superRole: profile.superRole,
          descopeUserId: profile.sub,
          ...tokens,
        };
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({
      token,
      account,
      profile,
      user,
    }: {
      token;
      account;
      profile;
      user;
    }) {
      try {
        if (account?.id_token) {
          token.idToken = account.id_token;
        }

        console.log('0 - account: ', account);

        if (account?.access_token) {
          token.accessToken = account.access_token.toString();
        }

        if (profile) {
          token.profile = profile;
        }

        // This condition will only be true if the user was signed in via the Credentials provider.
        if (user?.credentials) {
          (user as any).password = undefined;
          (user as any).salt = undefined;

          token.user = user;
        }

        return token;
      } catch (error) {
        console.error('jwt() callback error: ', error);
      }
    },
    async session({ session, token }: { session; token }) {
      try {
        if (token.profile) {
          session.user = token.profile;
        }

        // This condition will only be true if the user was signed in via the Credentials provider.
        if (token?.user?.credentials) {
          session.user = token.user;
        }

        session.error = token.error;

        if (token.access_token) {
          session.accessToken = token.access_token;
        }

        if (token.idToken) {
          session.idToken = token.idToken;
        }

        session.accessToken = token.accessToken;

        const projectName = global?.projectName || '';


        session.user = {
          ...session.user,
          descopeUserId: session.user.sub,
          projectName,
        } as any;

        return session;
      } catch (error) {
        console.error('session() callback error: ', error);
      }
    },
    async redirect({ url }) {
      try {
        console.log('0 - redirect url: ', url);

        const projectName = url.split('.')[0].split('/')[2];

        global.projectName = projectName;

        return url;
      } catch (error) {
        console.error('redirect() callback error: ', error);
      }
    },
  },
};


export default async (req: NextRequest, res: NextResponse) => {
  const env = 'local';
  const protocol = env === 'local' ? 'http' : 'https';
  const { host } = req.headers as unknown as { [key: string]: string };

  const projectName =
    (!host.split('.')[0].includes('localhost') && host.split('.')[0]) ||
    global.projectName;

  process.env.NEXTAUTH_URL = `${protocol}://${host}/api/auth`;
  global.projectName = projectName;
  console.log('0 - NEXTAUTH_URL: ', `${protocol}://${host}/api/auth`);
  console.log('0 - global.projectName: ', global.projectName);

  return await NextAuth(
    req as unknown as NextApiRequest,
    res as unknown as NextApiResponse,
    authOptions
  );
};