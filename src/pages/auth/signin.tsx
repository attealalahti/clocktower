import { signIn, useSession } from "next-auth/react";
import { NextPage } from "next";
import { FormEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { parse } from "url";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18n from "../../../next-i18next.config.mjs";

const SignIn: NextPage = () => {
  const [name, setName] = useState<string>("");
  const router = useRouter();
  const { data: session } = useSession();

  const getPreviousLocale = () => {
    const callbackUrl = router.query.callbackUrl as string;
    const parsedUrl = parse(callbackUrl, true);
    const path = parsedUrl.pathname?.substring(1);
    const firstPath = path?.substring(0, path?.indexOf("/"));
    if (firstPath && router.locales?.includes(firstPath)) {
      return firstPath;
    } else {
      return undefined;
    }
  };

  useEffect(() => {
    if (session) {
      const locale = getPreviousLocale() ?? "";
      router.replace(`/${locale}`);
    }
  }, [session]);

  const signInWithName: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const callbackUrl = router.query.callbackUrl as string;
    signIn("credentials", { name, callbackUrl });
  };
  return (
    <main className="min-w-screen flex flex-auto flex-col items-center justify-center gap-20 text-center">
      <form onSubmit={signInWithName}>
        <label>
          Name
          <input
            name="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button type="submit">Continue</button>
      </form>
    </main>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], { i18n })),
  },
});

export default SignIn;
