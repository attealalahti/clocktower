import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Character } from "../util/characters";
import Image from "next/image";
import loadingAnimation from "../../public/images/loading.svg";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18n from "../../next-i18next.config.mjs";
import { useTranslation } from "next-i18next";
import { useSession, signIn, getSession } from "next-auth/react";
import { ServerToClientEvents, ClientToServerEvents } from "../types/ws-types";
import ChangeLanguageButton from "../components/ChangeLanguageButton";
import Link from "next/link";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

const Play: NextPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  const [role, setRole] = useState<Character | undefined>(undefined);
  const [name, setName] = useState<string>("");
  const [showChar, setShowChar] = useState<boolean>(false);
  const { t } = useTranslation();

  async function fetchRole() {
    const currentSession = await getSession();
    if (currentSession?.user?.id) {
      socket.emit("ready", currentSession.user.id as unknown as number);
    }
  }

  useEffect(() => {
    socket.on("connect", fetchRole);
    socket.on("disconnect", () => setRole(undefined));
    socket.on("data", ({ name, role }) => {
      setName(name);
      setRole(role);
    });
    fetchRole();
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("data");
    };
  }, []);

  const changeName = async () => {
    const newName = prompt(t("enterName"), "");
    const currentSession = await getSession();
    if (newName && newName !== "" && currentSession?.user?.id) {
      socket.emit(
        "changeName",
        newName,
        currentSession.user.id as unknown as number
      );
      setName(newName);
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-grow-0 flex-row justify-items-center gap-3 text-center align-middle font-serif">
        <button
          onClick={changeName}
          className="m-auto ml-0 rounded-lg border border-white p-3 font-sans text-lg hover:cursor-pointer hover:bg-white hover:text-black"
        >
          {t("changeName")}
        </button>
        <ChangeLanguageButton />
      </div>
      <div className="mt-3 flex flex-1 flex-grow-0 flex-row justify-items-center gap-3 text-center align-middle font-serif">
        <div className="m-auto font-serif text-xl">{name}</div>
      </div>
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
              } mt-7 rounded-lg border border-white  font-bold`}
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
        <Link href="/cheatsheet">
          <div className="mt-10 rounded-lg bg-white p-4 text-2xl font-bold text-black hover:cursor-pointer">
            See all roles
          </div>
        </Link>
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
