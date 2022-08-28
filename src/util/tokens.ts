import type { CharId } from "./characters";

export type TokenId =
  | "butlerMaster"
  | "isDrunk"
  | "fortuneTellerRedHerring"
  | "investigatorDecoy"
  | "investigatorMinion"
  | "librarianDecoy"
  | "librarianOutsider"
  | "monkProtected"
  | "poisonerPoisoned"
  | "scarletWomanDemon"
  | "undertakerExecuted"
  | "slayerUsed"
  | "virginUsed"
  | "washerwomanTownsfolk"
  | "washerwomanDecoy"
  | "good"
  | "evil";

export type Token = {
  id: TokenId;
  icon: CharId | "good" | "evil";
  charIndependent?: boolean;
};

export const tokens = new Map<TokenId, Token>([
  ["butlerMaster", { id: "butlerMaster", icon: "butler" }],
  ["isDrunk", { id: "isDrunk", icon: "drunk", charIndependent: true }],
  [
    "fortuneTellerRedHerring",
    { id: "fortuneTellerRedHerring", icon: "fortune_teller" },
  ],
  ["investigatorDecoy", { id: "investigatorDecoy", icon: "investigator" }],
  ["investigatorMinion", { id: "investigatorMinion", icon: "investigator" }],
  ["librarianDecoy", { id: "librarianDecoy", icon: "librarian" }],
  ["librarianOutsider", { id: "librarianOutsider", icon: "librarian" }],
  ["monkProtected", { id: "monkProtected", icon: "monk" }],
  ["poisonerPoisoned", { id: "poisonerPoisoned", icon: "poisoner" }],
  ["scarletWomanDemon", { id: "scarletWomanDemon", icon: "scarlet_woman" }],
  ["undertakerExecuted", { id: "undertakerExecuted", icon: "undertaker" }],
  ["slayerUsed", { id: "slayerUsed", icon: "slayer" }],
  ["virginUsed", { id: "virginUsed", icon: "virgin" }],
  ["washerwomanTownsfolk", { id: "washerwomanTownsfolk", icon: "washerwoman" }],
  ["washerwomanDecoy", { id: "washerwomanDecoy", icon: "washerwoman" }],
  ["good", { id: "good", icon: "good", charIndependent: true }],
  ["evil", { id: "evil", icon: "evil", charIndependent: true }],
]);
