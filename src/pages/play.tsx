import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Character } from "../util/characters";

const socket = io();

const Play: NextPage = () => {
  const [connected, setConnected] = useState<boolean>(true);
  const [role, setRole] = useState<Character | undefined>(undefined);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("role", (role: Character) => setRole(role));
    socket.emit("ready");
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

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
      <main>
        <p>{connected ? "Connected" : "Disconnected"}</p>
        {role ? <p>{role.name}</p> : <></>}
      </main>
    </>
  );
};

export default Play;
