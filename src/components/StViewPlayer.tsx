import { useTranslation } from "next-i18next";
import { Player } from "../types/api-types";
import upArrow from "../../public/images/arrow_up.svg";
import downArrow from "../../public/images/arrow_down.svg";
import Image from "next/image";
import Modal from "../components/Modal";
import { useState } from "react";

type StViewPlayerProps = {
  player: Player;
  index: number;
  onSwap: (index: number, otherIndex: number) => void;
  onToggleDead: (id: number) => void;
};
const StViewPlayer = ({
  player,
  index,
  onSwap,
  onToggleDead,
}: StViewPlayerProps) => {
  const { t } = useTranslation();
  const [charSelectOpen, setCharSelectOpen] = useState<boolean>(false);
  return (
    <div
      key={player.id}
      className={`mt-2 w-full rounded-lg shadow-sm shadow-white ${
        player.dead && "opacity-50"
      }`}
    >
      <div className="flex w-full flex-row justify-center align-middle">
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
        <button
          onClick={() => onToggleDead(player.id)}
          className={`m-auto flex-auto font-serif text-lg ${
            player.dead && "line-through"
          }`}
        >
          {player.name}
        </button>
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
            <button onClick={() => setCharSelectOpen(false)}>Close</button>
          </div>
        </Modal>
      </div>
      <div className="flex flex-row flex-wrap p-1">
        <button className="rounded-lg bg-blue-300 p-1 text-black">
          {t("st.addToken")}
        </button>
      </div>
    </div>
  );
};

export default StViewPlayer;
