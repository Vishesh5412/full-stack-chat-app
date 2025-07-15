import "../styles/globals.css";
import useLoaderStore from "../store/loaderStore";
import SocketClient from "../components/SocketClient";
import Loader from "../components/loader/spinner";
import Toast from "../components/Toast/HotToast";
import { useEffect } from "react";
import Router from "next/router";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  const { showLoader, hideLoader } = useLoaderStore();
  useEffect(() => {
    const handleStart = () => showLoader();
    const handleStop = () => hideLoader();

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleStop);
    Router.events.on("routeChangeError", handleStop);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleStop);
      Router.events.off("routeChangeError", handleStop);
    };
  }, []);
  return (
    <>
      <head>
        <title>Whispr: Your everyday chatting app</title>
        <link rel="icon" href="/images/favicon.png" type="image/x-icon" />

      </head>
      <Loader />
      <Toast />
      <SocketClient />
      <Component {...pageProps} />
    </>
  );
}
