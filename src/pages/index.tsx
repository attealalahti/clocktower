import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import i18n from "../../next-i18next.config.mjs";

const Home: NextPage = () => {
  const { t } = useTranslation("common");

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
          <Link href="/play">
            <div className="flex h-40 w-60 items-center justify-center rounded-xl bg-red-800 p-3 text-center text-3xl font-bold leading-relaxed shadow-xl ring-1 ring-white hover:cursor-pointer hover:shadow-gray-800 active:bg-red-900">
              <span>{t("joinGame")}</span>
            </div>
          </Link>
          <a
            href="https://wiki.bloodontheclocktower.com/Trouble_Brewing"
            target="_blank"
            rel="noreferrer"
            className="text-center font-serif text-xl underline underline-offset-2"
          >
            Blood on the Clocktower Wiki
          </a>
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

export default Home;
