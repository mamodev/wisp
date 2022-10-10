import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { ReactElement } from "react";
import { AuthProvider } from "../context/AuthContext";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, props?: object) => React.ReactElement;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return <AuthProvider>{getLayout(<Component {...pageProps} />, pageProps)}</AuthProvider>;
}
