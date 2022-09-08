import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

const ChangeLanguageButton = () => {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Link href={router.asPath} locale={router.locale === "en" ? "fi" : "en"}>
      <button className="m-auto mr-0 rounded-lg border border-white p-3 font-sans text-lg hover:cursor-pointer hover:bg-white hover:text-black">
        {t("header.changeLanguage")}
      </button>
    </Link>
  );
};
export default ChangeLanguageButton;
