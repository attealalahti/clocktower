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
import { PlayerToServer } from "../types/api-types";
import upArrow from "../../public/images/arrow_up.svg";
import downArrow from "../../public/images/arrow_down.svg";
import { useTranslation } from "next-i18next";
import Modal from "../components/Modal";
import { CharId, characters as characterMap } from "../util/characters";

characterMap.delete("unassigned");
const characters = Array.from(characterMap);
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

const Storyteller: NextPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [dataState, setDataState] = useState<"loaded" | "loading" | "error">(
    "loading"
  );
  const [disconnected, setDisconnected] = useState<boolean>(false);
  const { t } = useTranslation();
  const [charSelectOpen, setCharSelectOpen] = useState<boolean>(false);
  const [selectedChars, setSelectedChars] = useState<CharId[]>([]);

  async function fetchPlayerData() {
    try {
      const { data: newPlayers }: { data: Player[] } = await axios.get(
        "/api/players"
      );
      setPlayers(newPlayers);
      const newSelectedChars: CharId[] = newPlayers.map(
        ({ character }) => character.id
      );
      setSelectedChars(newSelectedChars);
      setDataState("loaded");
    } catch (err) {
      setDataState("error");
      console.log(err);
    }
  }

  async function sendPlayerData(id: number, updatedPlayers: Player[]) {
    try {
      const playerToSend = updatedPlayers.find((player) => player.id === id);
      if (playerToSend) {
        const data: PlayerToServer = {
          name: playerToSend.name,
          order: playerToSend.order,
          stRole: playerToSend.character.id,
          tokens: playerToSend.tokens,
          dead: playerToSend.dead,
        };
        await axios.patch(`/api/players/${id}`, data);
      }
    } catch (err) {
      setDataState("error");
      console.log(err);
    }
  }

  useEffect(() => {
    socket.on("connect", () => {
      setDisconnected(false);
      fetchPlayerData();
    });
    socket.on("disconnect", () => setDisconnected(true));
    socket.on("playerDataChanged", fetchPlayerData);
    fetchPlayerData();
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("playerDataChanged");
    };
  }, []);

  const toggleDead = (id: number) => {
    const newPlayers = [...players];
    const index = newPlayers.findIndex((player) => player.id === id);
    if (newPlayers[index] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      newPlayers[index]!.dead = !newPlayers[index]!.dead;
      setPlayers(newPlayers);
      sendPlayerData(id, newPlayers);
    }
  };

  const toggleCharSelected = (id: CharId) => {
    const newSelectedChars = [...selectedChars];
    const index = newSelectedChars.findIndex((char) => char === id);
    if (index !== -1) {
      newSelectedChars.splice(index, 1);
    } else {
      newSelectedChars.push(id);
    }
    setSelectedChars(newSelectedChars);
  };

  const resetSelectedChars = () => {
    const newSelectedChars: CharId[] = players.map(
      ({ character }) => character.id
    );
    setSelectedChars(newSelectedChars);
  };

  const swapPlayers = (index: number, otherIndex: number) => {
    const newPlayers = [...players];
    if (otherIndex < 0) {
      otherIndex = newPlayers.length - 1;
    }
    if (otherIndex >= newPlayers.length) {
      otherIndex = 0;
    }
    const player1 = newPlayers[index] as Player;
    const player2 = newPlayers[otherIndex] as Player;
    const player1Order = player1.order;
    player1.order = player2.order;
    player2.order = player1Order;
    newPlayers[otherIndex] = player1;
    newPlayers[index] = player2;
    setPlayers(newPlayers);
    sendPlayerData(player1.id, newPlayers);
    sendPlayerData(player2.id, newPlayers);
  };

  return (
    <>
      <Header />
      <main className="min-w-screen flex flex-auto flex-col items-center justify-center text-center">
        {dataState === "loaded" ? (
          <div className="w-full">
            {players.map(({ id, name, character, dead }, index) => (
              <div
                key={id}
                className={`mt-2 w-full rounded-lg shadow-sm shadow-white ${
                  dead && "opacity-50"
                }`}
              >
                <div className="flex w-full flex-row justify-center align-middle">
                  <button
                    onClick={() => swapPlayers(index, index - 1)}
                    className="m-auto flex flex-1 flex-grow-0 justify-center p-2 pr-0 align-middle"
                  >
                    <Image
                      src={upArrow}
                      width={30}
                      height={30}
                      layout="fixed"
                      alt={t("st.upButton")}
                    />
                  </button>
                  <button
                    onClick={() => swapPlayers(index, index + 1)}
                    className="flex-2 m-auto flex flex-grow-0 justify-center p-2 pl-0 align-middle"
                  >
                    <Image
                      src={downArrow}
                      width={30}
                      height={30}
                      layout="fixed"
                      alt={t("st.downButton")}
                    />
                  </button>
                  <button
                    onClick={() => toggleDead(id)}
                    className={`m-auto flex-auto font-serif text-lg ${
                      dead && "line-through"
                    }`}
                  >
                    {name}
                  </button>
                  <button className="flex-4 flex w-28 flex-grow-0 flex-col justify-center align-middle">
                    <div
                      className={`m-auto mt-2 flex justify-center align-middle ${
                        character.type === "unassigned" && "hidden"
                      }`}
                    >
                      <Image
                        src={`/images/${character.id}.webp`}
                        width={59}
                        height={41}
                        layout={"fixed"}
                        alt={t(`characters.${character.id}.name`)}
                      />
                    </div>
                    <div className="m-auto font-serif">
                      {t(`characters.${character.id}.name`)}
                    </div>
                  </button>
                </div>
                <div className="flex flex-row flex-wrap p-1">
                  <button className="rounded-lg bg-blue-300 p-1 text-black">
                    {t("st.addToken")}
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setCharSelectOpen(true)}
              className="mt-4 rounded-xl bg-white p-4 font-bold text-black"
            >
              Select Characters
            </button>
            <Modal open={charSelectOpen}>
              <div className="box-border flex h-full w-full flex-col justify-center rounded-lg border border-white bg-[rgb(0,0,0,0.7)] align-middle text-white">
                <div className="flex-auto overflow-scroll border-b border-white">
                  <div className="text-center">Townsfolk (1/2)</div>
                  <div className="flex flex-row flex-wrap justify-center gap-2 align-middle">
                    {characters.map(([id]) => (
                      <button
                        onClick={() => toggleCharSelected(id)}
                        key={id}
                        className={`${
                          !selectedChars.includes(id) ? "opacity-50" : ""
                        } flex h-32 w-32 flex-col justify-center rounded-full border-4 border-gray-600 bg-gray-300 p-2 align-middle`}
                      >
                        <div className="mx-auto flex justify-center align-middle">
                          <Image
                            src={`/images/${id}.webp`}
                            width={71}
                            height={50}
                            layout="fixed"
                            alt={t(`characters.${id}.name`)}
                          />
                        </div>
                        <div className="mx-auto flex-grow-0 text-center font-serif text-black">
                          {t(`characters.${id}.name`)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-2 my-2 flex flex-grow-0 flex-row flex-wrap justify-center gap-3 align-middle">
                  <button className="rounded-xl border border-white bg-black p-4">
                    Shuffle
                  </button>
                  <button className="rounded-xl border border-white bg-black p-4">
                    Assign Randomly
                  </button>
                  <button
                    onClick={() => {
                      setCharSelectOpen(false);
                      resetSelectedChars();
                    }}
                    className="rounded-xl border border-white bg-black p-4"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        ) : dataState === "loading" ? (
          <Image alt="loading" src={loadingAnimation} />
        ) : (
          <div className="border border-red-500 p-4 text-lg text-red-500">
            {t("st.error")}
          </div>
        )}
        {disconnected && (
          <div className="mt-4 border border-red-500 p-4 text-lg text-red-500">
            {t("st.disconnected")}
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
