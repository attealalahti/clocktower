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

const socket = io();

const Play: NextPage = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  const [role, setRole] = useState<Character | undefined>(undefined);
  const { t } = useTranslation();

  async function fetchRole() {
    socket.emit("ready", (await getSession())?.user?.id);
  }

  useEffect(() => {
    socket.on("connect", fetchRole);
    socket.on("disconnect", () => setRole(undefined));
    socket.on("role", (role: Character) => setRole(role));
    fetchRole();
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <main className="min-w-screen flex flex-auto flex-col items-center justify-center text-center">
      {role && session /* && role.type !== "unassigned" */ ? (
        <>
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
    </main>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], { i18n })),
  },
});

export default Play;
