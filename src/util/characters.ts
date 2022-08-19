export type Character = {
  name: string;
  type: "Townsfolk" | "Outsider" | "Minion" | "Demon";
  description: string;
  nightOrder?: number;
  firstNightOrder?: number;
};
export type CharacterName =
  | "washerwoman"
  | "investigator"
  | "empath"
  | "undertaker"
  | "ravenkeeper"
  | "slayer"
  | "mayor"
  | "butler"
  | "recluse"
  | "poisoner"
  | "scarlet woman"
  | "imp"
  | "librarian"
  | "chef"
  | "fortune teller"
  | "monk"
  | "virgin"
  | "soldier"
  | "drunk"
  | "saint"
  | "spy"
  | "baron";

const characters = new Map<CharacterName, Character>([
  [
    "washerwoman",
    {
      name: "Washerwoman",
      type: "Townsfolk",
      description:
        "You start knowing that 1 of 2 players is a particular Townsfolk",
      firstNightOrder: 1,
    },
  ],
  [
    "investigator",
    {
      name: "Investigator",
      type: "Townsfolk",
      description:
        "You start knowing that 1 of 2 players is a particular Minion",
      firstNightOrder: 3,
    },
  ],
  [
    "empath",
    {
      name: "Empath",
      type: "Townsfolk",
      description:
        "Each night, you learn how many of your 2 alive neighbours are evil.",
      firstNightOrder: 5,
      nightOrder: 5,
    },
  ],
  [
    "undertaker",
    {
      name: "Undertaker",
      type: "Townsfolk",
      description:
        "Each night (except for the first night), you learn which character died by execution today.",
      nightOrder: 8,
    },
  ],
  [
    "ravenkeeper",
    {
      name: "Ravenkeeper",
      type: "Townsfolk",
      description:
        "If you die at night, you are woken to choose a player: you learn their character.",
      nightOrder: 4,
    },
  ],
  [
    "slayer",
    {
      name: "Slayer",
      type: "Townsfolk",
      description:
        "Once per game, during the day, publicly choose a player: if they are the Demon, they die.",
    },
  ],
  [
    "mayor",
    {
      name: "Mayor",
      type: "Townsfolk",
      description:
        "If only 3 players live and no execution occurs, your team wins. If you die at night, another player might die instead.",
    },
  ],
  [
    "butler",
    {
      name: "Butler",
      type: "Outsider",
      description:
        "Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.",
      firstNightOrder: 7,
      nightOrder: 7,
    },
  ],
  [
    "recluse",
    {
      name: "Recluse",
      type: "Outsider",
      description:
        "You might register as evil and as a Minion or Demon, even if dead.",
    },
  ],
  [
    "poisoner",
    {
      name: "Poisoner",
      type: "Minion",
      description:
        "Each night, choose a player: they are poisoned tonight and tomorrow day.",
      firstNightOrder: 0,
      nightOrder: 0,
    },
  ],
  [
    "scarlet woman",
    {
      name: "Scarlet Woman",
      type: "Minion",
      description:
        "If there are 5 or more players alive and the Demon dies, you become the Demon.",
      nightOrder: 2,
    },
  ],
  [
    "imp",
    {
      name: "Imp",
      type: "Demon",
      description:
        "Each night (except for the first night), choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.",
      nightOrder: 3,
    },
  ],
  [
    "librarian",
    {
      name: "Librarian",
      type: "Townsfolk",
      description:
        "You start knowing that 1 of 2 players is a particular Outsider. (Or that zero are in play.)",
      firstNightOrder: 2,
    },
  ],
  [
    "chef",
    {
      name: "Chef",
      type: "Townsfolk",
      description:
        "You start knowing how many pairs of evil players there are.",
      firstNightOrder: 4,
    },
  ],
  [
    "fortune teller",
    {
      name: "Fortune Teller",
      type: "Townsfolk",
      description:
        "Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you.",
      firstNightOrder: 6,
      nightOrder: 6,
    },
  ],
  [
    "monk",
    {
      name: "Monk",
      type: "Townsfolk",
      description:
        "Each night (except for the first night), choose a player (not yourself): they are safe from the Demon tonight.",
      nightOrder: 1,
    },
  ],
  [
    "virgin",
    {
      name: "Virgin",
      type: "Townsfolk",
      description:
        "The first time you are nominated, if the nominator is a Townsfolk, they are executed immediately.",
    },
  ],
  [
    "soldier",
    {
      name: "Soldier",
      type: "Townsfolk",
      description: "You are safe from the Demon",
    },
  ],
  [
    "drunk",
    {
      name: "Drunk",
      type: "Outsider",
      description:
        "You do not know you are the Drunk. You think you are a Townsfolk character, but you are not.",
    },
  ],
  [
    "saint",
    {
      name: "Saint",
      type: "Outsider",
      description: "If you die by execution, your team loses.",
    },
  ],
  [
    "spy",
    {
      name: "Spy",
      type: "Minion",
      description:
        "Each night, you see the Grimoire. You might register as good and as a Townsfolk or Outsider, even if dead.",
      firstNightOrder: 8,
      nightOrder: 9,
    },
  ],
  [
    "baron",
    {
      name: "Baron",
      type: "Minion",
      description: "There are 2 extra Outsiders in play.",
    },
  ],
]);

export const getCharacter = (charName: CharacterName): Character => {
  return characters.get(charName) as Character;
};