import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image.js";
import i18n from "../../next-i18next.config.mjs";
import CharacterInfoByType from "../components/CharacterInfoByType";
import Header from "../components/Header";
import { characters as characterMap } from "../util/characters";

characterMap.delete("unassigned");
const characters = Array.from(characterMap);
const firstNightChars = characters.filter(
  ([, char]) => char.firstNightOrder !== undefined
);
firstNightChars.sort(([, charA], [, charB]) => {
  charA.firstNightOrder = charA.firstNightOrder as number;
  charB.firstNightOrder = charB.firstNightOrder as number;
  return charA.firstNightOrder - charB.firstNightOrder;
});
const otherNightChars = characters.filter(
  ([, char]) => char.nightOrder !== undefined
);
otherNightChars.sort(([, charA], [, charB]) => {
  charA.nightOrder = charA.nightOrder as number;
  charB.nightOrder = charB.nightOrder as number;
  return charA.nightOrder - charB.nightOrder;
});

const CheatSheet: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <main className="min-w-screen flex flex-auto flex-col items-center justify-center text-center">
        <h2 className="mt-3 font-serif text-xl">{t("cs.characters")}</h2>
        <CharacterInfoByType type="townsfolk" characters={characters} />
        <CharacterInfoByType type="outsider" characters={characters} />
        <CharacterInfoByType type="minion" characters={characters} />
        <CharacterInfoByType type="demon" characters={characters} />
        <h2 className="my-3 font-serif text-xl">{t("cs.nightOrder")}</h2>
        <div className="flex flex-row flex-wrap gap-5">
          <div className="mx-auto">
            <h3 className="font-serif">{t("cs.firstNight")}</h3>
            <ol className="my-2 rounded-lg p-2 shadow-sm shadow-white">
              {firstNightChars.map(([id], index) => (
                <li
                  key={id}
                  className="flex flex-row justify-center gap-3 text-left align-middle font-serif"
                >
                  <div className="m-auto flex-1 flex-grow-0">{`${
                    index + 1
                  }.`}</div>
                  <div className="m-auto flex-auto">
                    {t(`characters.${id}.name`)}
                  </div>
                  <div className="flex-3 m-auto">
                    <Image
                      src={`/images/${id}.webp`}
                      alt={t(`characters.${id}.name`)}
                      width={59}
                      height={41}
                      layout={"fixed"}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="mx-auto">
            <h3 className="font-serif">{t("cs.otherNights")}</h3>
            <ol className="my-2 rounded-lg p-2 shadow-sm shadow-white">
              {otherNightChars.map(([id], index) => (
                <li
                  key={id}
                  className="flex flex-row justify-center gap-3 text-left align-middle font-serif"
                >
                  <div className="m-auto flex-1 flex-grow-0">{`${
                    index + 1
                  }.`}</div>
                  <div className="m-auto flex-auto">
                    {t(`characters.${id}.name`)}
                  </div>
                  <div className="flex-3 m-auto">
                    <Image
                      src={`/images/${id}.webp`}
                      alt={t(`characters.${id}.name`)}
                      width={59}
                      height={41}
                      layout={"fixed"}
                    />
                  </div>
                </li>
              ))}
            </ol>
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
