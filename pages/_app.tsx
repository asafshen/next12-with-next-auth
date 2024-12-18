import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps<any>) {
  const { session: nextAuthSession } = pageProps;
  return (
    <SessionProvider
      session={nextAuthSession}
      refetchInterval={600}
      refetchOnWindowFocus
    >
      <div>
        <div>
          <Link href="/">
            <a>Go to Home</a>
          </Link>
        </div>
        <div>
          <Link href="/page1">
            <a>Go to Page 1</a>
          </Link>
        </div>
        <div>
          <Link href="/page2">
            <a>Go to Page 2</a>
          </Link>
        </div>
      </div>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
