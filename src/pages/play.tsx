import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Character } from "../util/characters";
import Image from "next/image";
import loadingAnimation from "../../public/images/loading.svg";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18n from "../../next-i18next.config.mjs";
import { useTranslation } from "next-i18next";

const socket = io();

const Play: NextPage = () => {
  const [role, setRole] = useState<Character | undefined>(undefined);
  const { t } = useTranslation();

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
      <main className="min-w-screen mx-auto flex min-h-screen flex-col bg-gray-900 p-4 px-8 text-white">
        <h1 className="flex-1 flex-grow-0 text-center font-serif text-2xl">
          Clocktower App
        </h1>
        <div className="min-w-screen flex flex-auto flex-col items-center justify-center text-center">
          {role ? (
            <>
              <div className="mb-5 font-serif text-xl">You are the...</div>
              <Image
                src={`/images/${role.id}.webp`}
                alt={t(`characters.${role.id}.name`)}
                width={177}
                height={124}
              />
              <h1 className="mt-5 font-serif text-4xl">
                {t(`characters.${role.id}.name`)}
              </h1>
              <div
                className={`${
                  role.type === "townsfolk" || role.type === "outsider"
                    ? "text-blue-300"
                    : "text-red-600"
                } mt-1 text-lg`}
              >
                {t(`charTypes.${role.type}`)}
              </div>
              <p className="mt-7 max-w-xl text-xl">
                {t(`characters.${role.id}.power`)}
              </p>
            </>
          ) : (
            <Image src={loadingAnimation} alt="loading" />
          )}
        </div>
      </main>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], { i18n })),
  },
});

export default Play;
