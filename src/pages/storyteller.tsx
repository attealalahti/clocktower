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
import {
  CharId,
  characters as characterMap,
  modifiesGameSetup,
  CharType,
  Character,
  getCharacter,
} from "../util/characters";
import CharacterSelectByType from "../components/CharacterSelectByType";

characterMap.delete("unassigned");
const characters = Array.from(characterMap);

const getCharsOfType = (type: CharType): [CharId, Character][] => {
  return characters.filter(([, char]) => char.type === type);
};
const townsfolk = getCharsOfType("townsfolk");
const outsiders = getCharsOfType("outsider");
const minions = getCharsOfType("minion");
const demons = getCharsOfType("demon");

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
  const [removeModalOpen, setRemoveModalOpen] = useState<boolean>(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const fetchPlayerData = async () => {
    try {
      const { data: newPlayers }: { data: Player[] } = await axios.get(
        "/api/players"
      );
      setPlayers(newPlayers);
      if (!charSelectOpen) {
        resetSelectedChars(newPlayers);
      }
      setDataState("loaded");
    } catch (err) {
      setDataState("error");
      console.log(err);
    }
  };

  const sendPlayerData = async (id: number, updatedPlayers: Player[]) => {
    try {
      const playerToSend = updatedPlayers.find((player) => player.id === id);
      if (playerToSend) {
        const data: PlayerToServer = {
          id: playerToSend.id,
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
  };

  const sendAllPlayerData = async (updatedPlayers: Player[]) => {
    try {
      const data: PlayerToServer[] = updatedPlayers.map((player) => {
        return {
          id: player.id,
          name: player.name,
          order: player.order,
          tokens: player.tokens,
          dead: player.dead,
          stRole: player.character.id,
        };
      });
      await axios.patch("/api/players", data);
    } catch (err) {
      setDataState("error");
      console.log(err);
    }
  };

  const removePlayer = (id: number) => {
    const confirmation = confirm(
      t("st.removeConfirm", {
        name: players.find((player) => player.id === id)?.name,
      })
    );
    if (confirmation) {
      socket.emit("removePlayer", id);
      const newPlayers = players.filter((player) => player.id !== id);
      setPlayers(newPlayers);
      setRemoveModalOpen(false);
    }
  };

  const sendCharactersToPlayers = () => {
    const confirmation = confirm(t("st.sendConfirm"));
    if (confirmation) {
      const ids: number[] = players.map((player) => player.id);
      socket.emit("sendCharacters", ids);
    }
  };

  const getMaxOfType = (type: CharType): number => {
    const playerCount = players.length;
    switch (type) {
      case "townsfolk":
        if (playerCount <= 6) {
          return 3;
        } else if (playerCount <= 9) {
          return 5;
        } else if (playerCount <= 12) {
          return 7;
        } else {
          return 9;
        }
      case "outsider":
        if (
          playerCount <= 5 ||
          playerCount === 7 ||
          playerCount === 10 ||
          playerCount === 13
        ) {
          return 0;
        } else if (
          playerCount === 6 ||
          playerCount === 8 ||
          playerCount === 11 ||
          playerCount === 14
        ) {
          return 1;
        } else {
          return 2;
        }
      case "minion":
        if (playerCount <= 9) {
          return 1;
        } else if (playerCount <= 12) {
          return 2;
        } else {
          return 3;
        }
      default:
        // Demon
        return 1;
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

  const resetSelectedChars = (players: Player[]) => {
    const newSelectedChars: CharId[] = [];
    players.forEach(({ character }) => {
      if (character.id !== "unassigned") {
        newSelectedChars.push(character.id);
      }
    });
    setSelectedChars(newSelectedChars);
  };

  const shuffleCharSelect = () => {
    let charsToSelect = new Set<CharId>();
    charsToSelect = addCharsOfTypeToSet("townsfolk", townsfolk, charsToSelect);
    charsToSelect = addCharsOfTypeToSet("outsider", outsiders, charsToSelect);
    charsToSelect = addCharsOfTypeToSet("minion", minions, charsToSelect);
    charsToSelect = addCharsOfTypeToSet("demon", demons, charsToSelect);
    const newSelectedChars = Array.from(charsToSelect);
    setSelectedChars(newSelectedChars);
  };

  const addCharsOfTypeToSet = (
    type: CharType,
    charsOfType: [CharId, Character][],
    set: Set<CharId>
  ) => {
    const sizeBeforeAdditions = set.size;
    while (set.size < getMaxOfType(type) + sizeBeforeAdditions) {
      const randomIndex = Math.floor(Math.random() * charsOfType.length);
      if (charsOfType[randomIndex] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        set.add(charsOfType[randomIndex]![0]);
      }
    }
    return set;
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

  const isGameSetupModified = (): boolean => {
    let result = false;
    selectedChars.forEach((char) => {
      if (modifiesGameSetup.includes(char)) {
        result = true;
      }
    });
    return result;
  };

  const shufflePlayerArray = (array: Player[]) => {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      const player1 = array[currentIndex] as Player;
      const player2 = array[randomIndex] as Player;
      array[currentIndex] = player2;
      array[randomIndex] = player1;
    }
  };

  const assignChars = () => {
    if (selectedChars.length <= players.length) {
      const newPlayers = [...players];
      newPlayers.forEach((player) => {
        player.character = { id: "unassigned", type: "unassigned" };
      });
      shufflePlayerArray(newPlayers);
      selectedChars.forEach((charId, index) => {
        if (newPlayers[index]) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          newPlayers[index]!.character = getCharacter(charId);
        }
      });
      newPlayers.sort((a, b) => a.order - b.order);
      setPlayers(newPlayers);
      setCharSelectOpen(false);
      sendAllPlayerData(newPlayers);
    }
  };

  return (
    <>
      <Header />
      <main className="min-w-screen flex flex-auto flex-col items-center justify-center text-center">
        {dataState === "loaded" ? (
          <div className="w-full lg:max-w-2xl">
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
              className="mx-auto mt-4 block rounded-xl bg-white p-4 font-bold text-black"
            >
              {t("st.selectChars")}
            </button>
            <Modal open={charSelectOpen}>
              <div className="box-border flex h-full w-full flex-col justify-center rounded-lg border border-white bg-[rgb(0,0,0,0.7)] align-middle text-white">
                <div className="flex-auto overflow-scroll border-b border-white">
                  <CharacterSelectByType
                    characters={townsfolk}
                    selectedChars={selectedChars}
                    type="townsfolk"
                    maxOfType={getMaxOfType("townsfolk")}
                    onSelect={toggleCharSelected}
                  />
                  <CharacterSelectByType
                    characters={outsiders}
                    selectedChars={selectedChars}
                    type="outsider"
                    maxOfType={getMaxOfType("outsider")}
                    onSelect={toggleCharSelected}
                  />
                  <CharacterSelectByType
                    characters={minions}
                    selectedChars={selectedChars}
                    type="minion"
                    maxOfType={getMaxOfType("minion")}
                    onSelect={toggleCharSelected}
                  />
                  <CharacterSelectByType
                    characters={demons}
                    selectedChars={selectedChars}
                    type="demon"
                    maxOfType={getMaxOfType("demon")}
                    onSelect={toggleCharSelected}
                  />
                </div>
                <div className="flex-2 my-2 flex flex-grow-0 flex-row flex-wrap justify-center gap-3 align-middle">
                  <div
                    className={`w-full text-center text-red-500 ${
                      isGameSetupModified() ? "" : "hidden"
                    }`}
                  >
                    {t("st.selectedCharsModifySetup")}
                  </div>
                  <button
                    className="rounded-xl border border-white bg-black p-2"
                    onClick={shuffleCharSelect}
                  >
                    {t("st.shuffle")}
                  </button>
                  <button
                    className={`rounded-xl border border-white bg-black p-2 ${
                      selectedChars.length > players.length ? "opacity-50" : ""
                    }`}
                    onClick={assignChars}
                    disabled={selectedChars.length > players.length}
                  >
                    {t("st.assign")}
                  </button>
                  <button
                    onClick={() => {
                      setCharSelectOpen(false);
                      resetSelectedChars(players);
                    }}
                    className="rounded-xl border border-white bg-black p-2"
                  >
                    {t("st.cancel")}
                  </button>
                </div>
              </div>
            </Modal>
            <button
              onClick={sendCharactersToPlayers}
              className="mx-auto mt-4 block rounded-xl bg-white p-4 font-bold text-black"
            >
              {t("st.sendChars")}
            </button>
            <button
              onClick={() => setRemoveModalOpen(true)}
              className="mx-auto mt-4 block rounded-xl bg-white p-3 font-bold text-red-700"
            >
              {t("st.removePlayer")}
            </button>
            <Modal open={removeModalOpen}>
              <div className="box-border flex h-full w-full flex-col justify-center rounded-lg border border-white bg-[rgb(0,0,0,0.7)] align-middle text-white">
                <div className="border-b border-white p-1 text-center text-lg">
                  {t("st.removePlayerTitle")}
                </div>
                <div className="flex flex-auto flex-col gap-2 overflow-scroll border-b border-white p-1">
                  {players.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => removePlayer(player.id)}
                      className="rounded-lg border border-white bg-[rgb(255,255,255,0.1)] py-3 text-center font-serif text-xl"
                    >
                      {player.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setRemoveModalOpen(false)}
                  className="flex-3 my-2 flex flex-grow-0 flex-row flex-wrap justify-center gap-3 align-middle"
                >
                  {t("st.cancel")}
                </button>
              </div>
            </Modal>
          </div>
        ) : dataState === "loading" ? (
          <Image alt={t("loading")} src={loadingAnimation} />
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
