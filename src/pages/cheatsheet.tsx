import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image.js";
import i18n from "../../next-i18next.config.mjs";
import Header from "../components/Header";
import { characters as characterMap } from "../util/characters";

const CheatSheet: NextPage = () => {
  characterMap.delete("unassigned");
  const characters = Array.from(characterMap);

  const { t } = useTranslation();
  return (
    <>
      <Header />
      <main className="min-w-screen flex flex-auto flex-col items-center justify-center text-center">
        <h2 className="mt-3 font-serif text-xl">{t("cs.characters")}</h2>
        {characters.map(([id]) => (
          <div
            key={id}
            className="my-3 flex w-full flex-row justify-center rounded-lg p-3 align-middle shadow-sm shadow-white lg:max-w-2xl"
          >
            <div className="m-auto max-w-md flex-1 flex-grow-0">
              <div className="mb-3 font-serif">
                {t(`characters.${id}.name`)}
              </div>
              <Image
                src={`/images/${id}.webp`}
                alt={t(`characters.${id}.name`)}
                width={100}
                height={70}
                layout={"fixed"}
              />
            </div>
            <div className="ml-3 flex flex-auto flex-col justify-center align-middle">
              <div>{t(`characters.${id}.power`)}</div>
            </div>
          </div>
        ))}
        <h2 className="font-serif text-xl">{t("cs.nightOrder")}</h2>
        <div>
          <div>
            <h3>{t("cs.firstNight")}</h3>
          </div>
          <div>
            <h3>{t("cs.otherNights")}</h3>
          </div>
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

export default CheatSheet;
