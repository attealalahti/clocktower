import { Character, CharId, CharType } from "../util/characters";
import Image from "next/image";
import { useTranslation } from "next-i18next";

type CharacterSelectByTypeProps = {
  characters: [CharId, Character][];
  selectedChars: CharId[];
  type: CharType;
  playerCount: number;
  onSelect: (id: CharId) => void;
};
const CharacterSelectByType = ({
  characters,
  selectedChars,
  type,
  playerCount,
  onSelect,
}: CharacterSelectByTypeProps) => {
  const { t } = useTranslation();

  function getCharsOfType(): [CharId, Character][] {
    return characters.filter(([, char]) => char.type === type);
  }

  function getMaxOfType(): number {
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
        return 1;
    }
  }

  function getCurrentOfType(): number {
    let result = 0;
    getCharsOfType().forEach(([id]) => {
      if (selectedChars.includes(id)) {
        result++;
      }
    });
    return result;
  }

  return (
    <>
      <div className="text-center font-serif text-lg">{`${t(
        `cs.${type}`
      )} (${getCurrentOfType()}/${getMaxOfType()})`}</div>
      <div className="mb-2 flex flex-row flex-wrap justify-center gap-2 align-middle">
        {getCharsOfType().map(([id]) => (
          <button
            onClick={() => onSelect(id)}
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
    </>
  );
};
export default CharacterSelectByType;
