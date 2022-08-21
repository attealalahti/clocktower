import { NextPage } from "next";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Character } from "../util/characters";
import Image from "next/image";
import loadingAnimation from "../../public/images/loading.svg";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18n from "../../next-i18next.config.mjs";
import { useTranslation } from "next-i18next";
import { useSession, signIn, getSession } from "next-auth/react";
import { ServerEmit, ClientEmit } from "../util/ws-enums";
import Header from "../components/Header";

const socket = io();

const Play: NextPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  const [role, setRole] = useState<Character | undefined>(undefined);
  const [showChar, setShowChar] = useState<boolean>(false);
  const { t } = useTranslation();

  async function fetchRole() {
    socket.emit(ClientEmit.Ready, (await getSession())?.user?.id);
  }

  useEffect(() => {
    socket.on(ClientEmit.Connection, fetchRole);
    socket.on(ClientEmit.Disconnect, () => setRole(undefined));
    socket.on(ServerEmit.Role, (role: Character) => setRole(role));
    fetchRole();
    return () => {
      socket.off(ClientEmit.Connection);
      socket.off(ClientEmit.Disconnect);
    };
  }, []);

  return (
    <>
      <Header />
      <main className="min-w-screen flex flex-auto flex-col items-center justify-center text-center">
        {role && session && role.type !== "unassigned" ? (
          <>
            <div className="mt-5 px-3 text-2xl uppercase text-red-500">
              {t("warning")}
            </div>
            {showChar ? (
              <div className="mx-4 mt-10 rounded-lg p-6 shadow-sm shadow-white">
                <div className="mb-5 font-serif text-xl">{t("youAre")}</div>
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
                      : "text-red-500"
                  } mt-1 text-lg`}
                >
                  {t(`charTypes.${role.type}`)}
                </div>
                <p className="mt-7 max-w-xl text-xl">
                  {t(`characters.${role.id}.power`)}
                </p>
              </div>
            ) : (
              <></>
            )}
            <button
              className={`${
                showChar ? "p-3 text-base" : "p-4 text-xl"
              } mt-7 rounded-lg bg-gray-300 font-bold text-black`}
              onClick={() => setShowChar((current) => !current)}
            >
              {showChar ? t("hide") : t("show")}
            </button>
          </>
        ) : role && role.type === "unassigned" ? (
          <div className="dots p-3 font-serif text-2xl">{t("waiting")}</div>
        ) : (
          <Image src={loadingAnimation} alt="loading" />
        )}
      </main>
    </>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], { i18n })),
  },
});

export default Play;
