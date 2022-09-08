import { useTranslation } from "next-i18next";
import { Player } from "../types/api-types";
import upArrow from "../../public/images/arrow_up.svg";
import downArrow from "../../public/images/arrow_down.svg";
import addIcon from "../../public/images/add.svg";
import Image from "next/image";
import Modal from "../components/Modal";
import { useState } from "react";
import {
  Character,
  characters as characterMap,
  getCharacter,
} from "../util/characters";
import { TokenId, Token, tokens } from "../util/tokens";

const characters = Array.from(characterMap);

type StViewPlayerProps = {
  player: Player;
  index: number;
  onSwap: (index: number, otherIndex: number) => void;
  onToggleDead: (id: number) => void;
  onSelectChar: (playerId: number, character: Character) => void;
  onTokenAdd: (playerId: number, tokenId: string) => void;
  availableTokens: [TokenId, Token][];
};
const StViewPlayer = ({
  player,
  index,
  onSwap,
  onToggleDead,
  onSelectChar,
  onTokenAdd,
  availableTokens,
}: StViewPlayerProps) => {
  const { t } = useTranslation();
  const [charSelectOpen, setCharSelectOpen] = useState<boolean>(false);
  const [tokenSelectOpen, setTokenSelectOpen] = useState<boolean>(false);

  const getPlayerTokens = () => {
    const playerTokens: Token[] = [];
    for (const key in player.tokens) {
      if (player.tokens[key]) {
        const token = tokens.get(key as TokenId);
        if (token) {
          playerTokens.push(token);
        }
      }
    }
    return playerTokens;
  };

  return (
    /* Main container */
    <div
      key={player.id}
      className={`mt-2 w-full rounded-lg shadow-sm shadow-white ${
        player.dead && "opacity-50"
      }`}
    >
      {/* First row */}
      <div className="flex w-full flex-row justify-center align-middle">
        {/* Arrow buttons */}
        <button
          onClick={() => onSwap(index, index - 1)}
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
          onClick={() => onSwap(index, index + 1)}
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
        {/* Name */}
        <button
          onClick={() => onToggleDead(player.id)}
          className={`m-auto flex-auto font-serif text-lg ${
            player.dead && "line-through"
          }`}
        >
          {player.name}
        </button>
        {/* Character */}
        <button
          onClick={() => setCharSelectOpen(true)}
          className="flex-4 flex w-28 flex-grow-0 flex-col justify-center align-middle"
        >
          <div
            className={`m-auto mt-2 flex justify-center align-middle ${
              player.character.type === "unassigned" && "hidden"
            }`}
          >
            <Image
              src={`/images/${player.character.id}.webp`}
              width={59}
              height={41}
              layout={"fixed"}
              alt={t(`characters.${player.character.id}.name`)}
            />
          </div>
          <div className="m-auto font-serif">
            {t(`characters.${player.character.id}.name`)}
          </div>
        </button>
        <Modal open={charSelectOpen}>
          <div className="box-border flex h-full w-full flex-col justify-center rounded-lg border border-white bg-[rgb(0,0,0,0.7)] align-middle text-white">
            <div className="border-b border-white p-1 text-center text-lg">
              {t("st.selectCharTitle")}
            </div>
            <div className="flex flex-auto flex-row flex-wrap justify-center gap-2 overflow-scroll border-b border-white p-1 align-middle">
              {characters.map(([id]) => (
                <button
                  onClick={() => {
                    onSelectChar(player.id, getCharacter(id));
                    setCharSelectOpen(false);
                  }}
                  key={id}
                  className="flex h-28 w-28 flex-col justify-center rounded-full border-4 border-gray-600 bg-gray-300 p-2 align-middle"
                >
                  <div
                    className={`${
                      id === "unassigned" ? "hidden" : ""
                    } mx-auto flex justify-center align-middle`}
                  >
                    <Image
                      src={`/images/${id}.webp`}
                      width={63}
                      height={44}
                      layout="fixed"
                      alt={t(`characters.${id}.name`)}
                    />
                  </div>
                  <div className="mx-auto flex-grow-0 text-center font-serif text-sm text-black">
                    {t(`characters.${id}.name`)}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setCharSelectOpen(false)}
              className="flex-3 my-2 flex flex-grow-0 flex-row flex-wrap justify-center gap-3 align-middle"
            >
              {t("st.cancel")}
            </button>
          </div>
        </Modal>
      </div>
      {/* Second row */}
      <div className="flex flex-row flex-wrap gap-1 p-1 pt-0">
        {/* Add token button */}
        <button
          onClick={() => setTokenSelectOpen(true)}
          className="m-1 flex justify-center align-middle text-black"
        >
          <Image src={addIcon} alt={t("st.addToken")} width={45} height={45} />
        </button>
        <Modal open={tokenSelectOpen}>
          <div className="box-border flex h-full w-full flex-col justify-center rounded-lg border border-white bg-[rgb(0,0,0,0.7)] align-middle text-white">
            <div className="border-b border-white p-1 text-center text-lg">
              {t("st.selectTokenTitle")}
            </div>
            <div className="flex flex-auto flex-row flex-wrap justify-center gap-2 overflow-scroll border-b border-white p-1 align-middle">
              {availableTokens.map(([id, token]) => (
                <button
                  onClick={() => {
                    setTokenSelectOpen(false);
                    onTokenAdd(player.id, id);
                  }}
                  key={id}
                  className="flex h-28 w-28 flex-col justify-center rounded-full border-4 border-gray-600 bg-gray-300 p-2 align-middle"
                >
                  <div className="mx-auto flex justify-center align-middle">
                    <Image
                      src={`/images/${token.icon}.webp`}
                      width={63}
                      height={44}
                      layout="fixed"
                      alt={t(`tokens.${id}`)}
                    />
                  </div>
                  <div className="mx-auto flex-grow-0 text-center font-serif text-sm text-black">
                    {t(`tokens.${id}`)}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setTokenSelectOpen(false)}
              className="flex-3 my-2 flex flex-grow-0 flex-row flex-wrap justify-center gap-3 align-middle"
            >
              {t("st.cancel")}
            </button>
          </div>
        </Modal>
        {/* Tokens */}
        {getPlayerTokens().map(({ id, icon }, index) => (
          <button
            key={index}
            className="flex flex-row justify-center rounded-full border border-white p-1 px-2 align-middle"
          >
            <div className="m-auto">
              <Image
                src={`/images/${icon}.webp`}
                alt=""
                width={35.4}
                height={24.8}
              />
            </div>
            <div className="m-auto">{t(`tokens.${id}`)}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StViewPlayer;
