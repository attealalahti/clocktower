import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const Header = () => {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-grow-0 flex-row justify-items-center text-center align-middle font-serif">
      <Link href={router.asPath} locale={router.locale === "en" ? "fi" : "en"}>
        <div className="m-auto mr-0 rounded-lg border border-white p-3 font-sans text-lg hover:cursor-pointer hover:bg-white hover:text-black">
          {t("header.changeLanguage")}
        </div>
      </Link>
    </div>
  );
};
export default Header;
