import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import Link from "next/link";

//const socket = io();

const Home: NextPage = () => {
  /*
  const [connected, setConnected] = useState<boolean>(true);
  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
  */
  return (
    <>
      <Head>
        <title>Clocktower App</title>
        <meta
          name="description"
          content="App for running Blood on the Clocktower"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-w-screen mx-auto flex min-h-screen flex-col bg-gray-900 p-4 text-white">
        <h1 className="flex-1 flex-grow-0 text-center font-serif text-2xl">
          Clocktower App
        </h1>
        <div className="min-w-screen flex flex-auto flex-col items-center justify-center gap-20">
          <div className="flex h-32 w-60 items-center justify-center rounded-xl bg-red-800 p-3 text-center text-3xl font-bold leading-relaxed shadow-xl ring-1 ring-white hover:shadow-gray-800 active:bg-red-900">
            <Link href="/play">Click here to join the game!</Link>
          </div>
          <a
            href="https://wiki.bloodontheclocktower.com/Trouble_Brewing"
            target="_blank"
            rel="noreferrer"
            className="font-serif text-xl underline underline-offset-2"
          >
            Blood on the Clocktower Wiki
          </a>
        </div>
      </main>
    </>
  );
};

export default Home;
