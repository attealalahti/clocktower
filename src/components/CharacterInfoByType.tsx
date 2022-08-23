import { useTranslation } from "next-i18next";
import { Character, CharId, CharType } from "../util/characters";
import Image from "next/image";

type CharInfoByTypeProps = {
  characters: [CharId, Character][];
  type: CharType;
};
const CharacterInfoByType = (props: CharInfoByTypeProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="mt-3 flex w-full flex-row gap-10 px-4 lg:max-w-2xl">
        <hr className="w-max-full m-auto h-0 w-[200px] flex-auto border border-white bg-white" />
        <h3 className="flex-2 flex-grow-0 font-serif text-lg">
          {t(`cs.${props.type}`)}
        </h3>
        <hr className="w-max-full m-auto h-0 w-[200px] flex-auto border border-white bg-white" />
      </div>
      {props.characters
        .filter(([, char]) => char.type === props.type)
        .map(([id]) => (
          <div
            key={id}
            className="my-3 flex w-full flex-row justify-center rounded-lg p-3 align-middle shadow-sm shadow-white lg:max-w-2xl"
          >
            <div className="m-auto max-w-md flex-1 flex-grow-0">
              <h4 className="mb-3 font-serif">{t(`characters.${id}.name`)}</h4>
              <Image
                src={`/images/${id}.webp`}
                alt={t(`characters.${id}.name`)}
                width={100}
                height={70}
                layout={"fixed"}
              />
            </div>
            <section className="ml-3 flex flex-auto flex-col justify-center align-middle">
              <div>{t(`characters.${id}.power`)}</div>
            </section>
          </div>
        ))}
    </>
  );
};
export default CharacterInfoByType;
