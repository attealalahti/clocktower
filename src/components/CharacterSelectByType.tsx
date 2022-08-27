import {
  Character,
  CharId,
  CharType,
  modifiesGameSetup,
} from "../util/characters";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import warningIcon from "../../public/images/warning.svg";

type CharacterSelectByTypeProps = {
  characters: [CharId, Character][];
  selectedChars: CharId[];
  type: CharType;
  maxOfType: number;
  onSelect: (id: CharId) => void;
};
const CharacterSelectByType = ({
  characters,
  selectedChars,
  type,
  maxOfType,
  onSelect,
}: CharacterSelectByTypeProps) => {
  const { t } = useTranslation();

  function getCurrentOfType(): number {
    let result = 0;
    characters.forEach(([id]) => {
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
      )} (${getCurrentOfType()}/${maxOfType})`}</div>
      <div className="mb-2 flex flex-row flex-wrap justify-center gap-2 align-middle">
        {characters.map(([id]) => (
          <button
            onClick={() => onSelect(id)}
            key={id}
            className={`${
              !selectedChars.includes(id) ? "opacity-50" : ""
            } relative flex h-28 w-28 flex-col justify-center rounded-full border-4 border-gray-600 bg-gray-300 p-2 align-middle`}
          >
            <div className="mx-auto flex justify-center align-middle">
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
            <div
              className={`absolute -right-2 -top-2 ${
                modifiesGameSetup.includes(id) && selectedChars.includes(id)
                  ? ""
                  : "hidden"
              }`}
            >
              <Image
                src={warningIcon}
                alt={t("st.charModifiesSetup")}
                width={50}
                height={50}
              />
            </div>
          </button>
        ))}
      </div>
    </>
  );
};
export default CharacterSelectByType;
