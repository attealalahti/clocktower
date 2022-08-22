import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
        <h2 className="font-serif text-xl">{t("cs.characters")}</h2>
        {characters.map(([id, char]) => (
          <div key={id}>{t(`characters.${char.id}.name`)}</div>
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
