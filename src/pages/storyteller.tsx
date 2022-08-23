import axios from "axios";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import i18n from "../../next-i18next.config.mjs";
import Header from "../components/Header";
import { ClientToServerEvents, ServerToClientEvents } from "../types/ws-types";
import { Player } from "../types/api-types";

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
          <div>loading</div>
        ) : (
          <div>error</div>
        )}
        {disconnected && <div>disconnected</div>}
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
