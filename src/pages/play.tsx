import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Character } from "../util/characters";
import Image from "next/image";
import loadingAnimation from "../../public/images/loading.svg";

const socket = io();

const Play: NextPage = () => {
  const [role, setRole] = useState<Character | undefined>(undefined);

  useEffect(() => {
    socket.on("connect", () => socket.emit("ready"));
    socket.on("disconnect", () => setRole(undefined));
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
      <main className="min-w-screen mx-auto flex min-h-screen flex-col bg-gray-900 p-4 text-white">
        <h1 className="flex-1 flex-grow-0 text-center font-serif text-2xl">
          Clocktower App
        </h1>
        <div className="min-w-screen flex flex-auto flex-col items-center justify-center gap-10 text-center">
          {role ? (
            <>
              <div>You are the...</div>
              <Image
                src={`/images/${role.name}.webp`}
                alt={role.nameEn}
                width={177}
                height={124}
              />
              <h1>{role.nameEn}</h1>
              <div>{role.type}</div>
              <p>{role.description}</p>
            </>
          ) : (
            <Image src={loadingAnimation} alt="loading" />
          )}
        </div>
      </main>
    </>
  );
};

export default Play;
