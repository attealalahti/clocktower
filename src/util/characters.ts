import { z } from "zod";

export const CharIdSchema = z.enum([
  "unassigned",
  "washerwoman",
  "investigator",
  "empath",
  "undertaker",
  "ravenkeeper",
  "slayer",
  "mayor",
  "butler",
  "recluse",
  "poisoner",
  "scarlet_woman",
  "imp",
  "librarian",
  "chef",
  "fortune_teller",
  "monk",
  "virgin",
  "soldier",
  "drunk",
  "saint",
  "spy",
  "baron",
]);

export type CharId = z.infer<typeof CharIdSchema>;

export type CharType =
  | "townsfolk"
  | "outsider"
  | "minion"
  | "demon"
  | "unassigned";

export type Character = {
  id: CharId;
  type: CharType;
  nightOrder?: number;
  firstNightOrder?: number;
};

export const characters = new Map<CharId, Character>([
  ["unassigned", { id: "unassigned", type: "unassigned" }],
  [
    "washerwoman",
    {
      id: "washerwoman",
      type: "townsfolk",
      firstNightOrder: 1,
    },
  ],
  [
    "investigator",
    {
      id: "investigator",
      type: "townsfolk",
      firstNightOrder: 3,
    },
  ],
  [
    "empath",
    {
      id: "empath",
      type: "townsfolk",
      firstNightOrder: 5,
      nightOrder: 5,
    },
  ],
  [
    "undertaker",
    {
      id: "undertaker",
      type: "townsfolk",
      nightOrder: 8,
    },
  ],
  [
    "ravenkeeper",
    {
      id: "ravenkeeper",
      type: "townsfolk",
      nightOrder: 4,
    },
  ],
  [
    "slayer",
    {
      id: "slayer",
      type: "townsfolk",
    },
  ],
  [
    "mayor",
    {
      id: "mayor",
      type: "townsfolk",
    },
  ],
  [
    "butler",
    {
      id: "butler",
      type: "outsider",
      firstNightOrder: 7,
      nightOrder: 7,
    },
  ],
  [
    "recluse",
    {
      id: "recluse",
      type: "outsider",
    },
  ],
  [
    "poisoner",
    {
      id: "poisoner",
      type: "minion",
      firstNightOrder: 0,
      nightOrder: 0,
    },
  ],
  [
    "scarlet_woman",
    {
      id: "scarlet_woman",
      type: "minion",
      nightOrder: 2,
    },
  ],
  [
    "imp",
    {
      id: "imp",
      type: "demon",
      nightOrder: 3,
    },
  ],
  [
    "librarian",
    {
      id: "librarian",
      type: "townsfolk",
      firstNightOrder: 2,
    },
  ],
  [
    "chef",
    {
      id: "chef",
      type: "townsfolk",
      firstNightOrder: 4,
    },
  ],
  [
    "fortune_teller",
    {
      id: "fortune_teller",
      type: "townsfolk",
      firstNightOrder: 6,
      nightOrder: 6,
    },
  ],
  [
    "monk",
    {
      id: "monk",
      type: "townsfolk",
      nightOrder: 1,
    },
  ],
  [
    "virgin",
    {
      id: "virgin",
      type: "townsfolk",
    },
  ],
  [
    "soldier",
    {
      id: "soldier",
      type: "townsfolk",
    },
  ],
  [
    "drunk",
    {
      id: "drunk",
      type: "outsider",
    },
  ],
  [
    "saint",
    {
      id: "saint",
      type: "outsider",
    },
  ],
  [
    "spy",
    {
      id: "spy",
      type: "minion",
      firstNightOrder: 8,
      nightOrder: 9,
    },
  ],
  [
    "baron",
    {
      id: "baron",
      type: "minion",
    },
  ],
]);

export const getCharacter = (id: CharId): Character => {
  return characters.get(id) as Character;
};
