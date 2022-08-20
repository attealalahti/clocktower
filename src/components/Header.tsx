import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const Header = () => {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-grow-0 flex-row justify-items-center text-center align-middle font-serif">
      <Link href={router.asPath} locale={router.locale === "en" ? "fi" : "en"}>
        <div className="m-auto mr-0 rounded-lg p-3 font-sans text-lg shadow-sm shadow-white hover:cursor-pointer">
          {t("header.changeLanguage")}
        </div>
      </Link>
    </div>
  );
};
export default Header;
