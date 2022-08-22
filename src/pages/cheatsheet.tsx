import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18n from "../../next-i18next.config.mjs";

const CheatSheet: NextPage = () => {
  return <main></main>;
};
export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], { i18n })),
  },
});

export default CheatSheet;
