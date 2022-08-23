import axios from "axios";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import i18n from "../../next-i18next.config.mjs";
import Header from "../components/Header";
import { ClientToServerEvents, ServerToClientEvents } from "../types/ws-types";
import { Player } from "../types/api-types";
import Image from "next/image";
import loadingAnimation from "../../public/images/loading.svg";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

const Storyteller: NextPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [dataState, setDataState] = useState<"loaded" | "loading" | "error">(
    "loading"
  );
  const [disconnected, setDisconnected] = useState<boolean>(false);

  async function fetchPlayerData() {
    try {
      const { data: newPlayers }: { data: Player[] } = await axios.get(
        "/api/players"
      );
      setPlayers(newPlayers);
      setDataState("loaded");
    } catch (err) {
      setDataState("error");
      console.log(err);
    }
  }

  useEffect(() => {
    socket.on("connect", () => setDisconnected(false));
    socket.on("disconnect", () => setDisconnected(true));
    socket.on("playerDataChanged", fetchPlayerData);
    fetchPlayerData();
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("playerDataChanged");
    };
  }, []);

  return (
    <>
      <Header />
      <main className="min-w-screen flex flex-auto flex-col items-center justify-center text-center">
        {dataState === "loaded" ? (
          <div>data loaded</div>
        ) : dataState === "loading" ? (
          <Image alt="loading" src={loadingAnimation} />
        ) : (
          <div className="border border-red-500 p-4 text-lg text-red-500">
            An error occurred.
          </div>
        )}
        {disconnected && (
          <div className="mt-4 border border-red-500 p-4 text-lg text-red-500">
            You are disconnected. Live updates have stopped.
          </div>
        )}
      </main>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], { i18n })),
  },
});

export default Storyteller;
