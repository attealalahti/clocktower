import { signIn, useSession } from "next-auth/react";
import { NextPage } from "next";
import { FormEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { parse } from "url";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18n from "../../../next-i18next.config.mjs";
import loadingAnimation from "../../../public/images/loading.svg";
import Image from "next/image.js";

const SignIn: NextPage = () => {
  const [name, setName] = useState<string>("");
  const [signing, setSigning] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    document.getElementById("name")?.focus();
  }, []);

  useEffect(() => {
    if (session) {
      const callbackUrl = router.query.callbackUrl as string;
      const parsedUrl = parse(callbackUrl, true);
      const path = parsedUrl.pathname?.substring(1);
      const firstPath = path?.substring(0, path?.indexOf("/"));
      let locale = "";
      if (firstPath && router.locales?.includes(firstPath)) {
        locale = firstPath;
      }
      router.replace(`/${locale}`);
    }
  }, [session, router]);

  const signInWithName: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!signing) {
      setSigning(true);
      const callbackUrl = router.query.callbackUrl as string;
      signIn("credentials", { name, callbackUrl });
    }
  };
  return signing ? (
    <main className="min-w-screen flex flex-auto flex-col items-center justify-center gap-20 text-center">
      <Image src={loadingAnimation} alt="loading" />
    </main>
  ) : (
    <main className="min-w-screen flex flex-auto flex-col items-center justify-center gap-20 text-center">
      <form
        onSubmit={signInWithName}
        className="flex flex-col items-center justify-center"
      >
        <label htmlFor="name" className="mb-3 p-4 text-2xl">
          Enter your name:
        </label>
        <input
          className="rounded-md text-center text-2xl font-bold leading-loose text-black"
          id="name"
          name="name"
          type="text"
          autoComplete="off"
          required={true}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="mt-10 rounded-xl bg-white p-3 text-2xl text-black"
        >
          Continue
        </button>
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
