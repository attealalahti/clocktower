import Head from "next/head";

type LayoutProps = {
  children: React.ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
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
      <div className="min-w-screen mx-auto flex min-h-screen flex-col bg-gray-900 p-4 text-white">
        {children}
      </div>
    </>
  );
};
export default Layout;
