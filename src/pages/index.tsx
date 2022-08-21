import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import i18n from "../../next-i18next.config.mjs";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router.js";

const Home: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();

  const joinGame = () => {
    if (session) {
      router.push("/play");
    } else {
      signIn(undefined, { callbackUrl: `/${router.locale}/play` });
    }
  };

  return (
    <main className="min-w-screen flex flex-auto flex-col items-center justify-center gap-20 text-center">
      <h1 className="mt-5 font-serif text-4xl">Clocktower App</h1>
      <button
        onClick={joinGame}
        className="flex h-40 w-60 items-center justify-center rounded-xl bg-red-800 p-3 text-3xl font-bold leading-relaxed shadow-xl ring-1 ring-white hover:cursor-pointer hover:shadow-gray-800 active:bg-red-900"
      >
        <span>{t("joinGame")}</span>
      </button>
      <a
        href="https://wiki.bloodontheclocktower.com/Trouble_Brewing"
        target="_blank"
        rel="noreferrer"
        className="mb-5 font-serif text-xl underline underline-offset-2"
      >
        Blood on the Clocktower Wiki
      </a>
    </main>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], { i18n })),
  },
});

export default Home;
