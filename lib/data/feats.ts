export type FeatCategory = 'origin' | 'general';

export interface Feat {
  id: string;
  name: string;
  category: FeatCategory;
  description: string;
  benefits: string[];
}

export const ORIGIN_FEATS: Feat[] = [
  {
    id: 'alert',
    name: 'Alert',
    category: 'origin',
    description: 'Always on the lookout for danger, you gain the following benefits.',
    benefits: [
      'Initiative Proficiency. When you roll Initiative, you can add your Proficiency Bonus to the roll.',
      'Initiative Swap. Immediately after you roll Initiative, you can swap your Initiative with the Initiative of one willing ally in the same combat. You can\'t make this swap if you or the ally has the Incapacitated condition.',
    ],
  },
  {
    id: 'crafter',
    name: 'Crafter',
    category: 'origin',
    description: 'You have practiced crafting one type of good many times, honing your skills. You gain the following benefits.',
    benefits: [
      'Tool Proficiency. You gain proficiency with three different Artisan\'s Tools of your choice.',
      'Discount. Whenever you buy a nonmagical item, you receive a 20 percent discount on it.',
      'Faster Crafting. When you craft an item using a tool with which you have proficiency, the required crafting time is halved.',
    ],
  },
  {
    id: 'healer',
    name: 'Healer',
    category: 'origin',
    description: 'You have the training and intuition to administer first aid and other care effectively, granting you the following benefits.',
    benefits: [
      'Battle Medic. If you have a Healer\'s Kit, you can expend one use of it and tend to a creature within 5 feet of you as a Utilize action. That creature can expend one of its Hit Point Dice, and you then roll that die. The creature regains a number of Hit Points equal to the roll plus your Proficiency Bonus.',
      'Healing Rerolls. Whenever you roll a die to determine the number of Hit Points you restore with a spell or with this feat\'s Battle Medic benefit, you can reroll the die if it rolls a 1, and you must use the new roll.',
    ],
  },
  {
    id: 'lucky',
    name: 'Lucky',
    category: 'origin',
    description: 'You have inexplicable luck that can kick in at just the right moment, granting you the following benefits.',
    benefits: [
      'Luck Points. You have 3 Luck Points. You can expend the points to use the following features. You regain your expended Luck Points when you finish a Long Rest.',
      'Advantage. Immediately after you roll a d20 for a d20 Test, you can spend 1 Luck Point to give yourself Advantage on the roll.',
      'Disadvantage. When a creature rolls a d20 for an attack roll against you, you can spend 1 Luck Point to impose Disadvantage on that roll.',
    ],
  },
  {
    id: 'magic-initiate',
    name: 'Magic Initiate',
    category: 'origin',
    description: 'You have learned the basics of a particular magical tradition. Choose one class: Cleric, Druid, or Wizard. You gain the following benefits related to that choice.',
    benefits: [
      'Two Cantrips. You learn two cantrips of your choice from the chosen class\'s spell list.',
      '1st-Level Spell. Choose one 1st-level spell from the chosen class\'s spell list. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have.',
      'Spellcasting Ability. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells (choose when you select this feat). Consult the chosen class\'s description for its spellcasting ability if you want to match it.',
    ],
  },
  {
    id: 'savage-attacker',
    name: 'Savage Attacker',
    category: 'origin',
    description: 'You have trained to deal particularly damaging strikes.',
    benefits: [
      'Once per turn when you hit a target with a weapon, you can roll the weapon\'s damage dice twice and use either roll against the target.',
    ],
  },
  {
    id: 'skilled',
    name: 'Skilled',
    category: 'origin',
    description: 'You have exceptionally broad learning. You gain proficiency in any combination of three skills or tools of your choice.',
    benefits: [
      'You gain proficiency in any combination of three skills or tools of your choice.',
    ],
  },
  {
    id: 'tavern-brawler',
    name: 'Tavern Brawler',
    category: 'origin',
    description: 'Accustomed to brawling, you gain the following benefits.',
    benefits: [
      'Enhanced Unarmed Strike. When you hit with your Unarmed Strike and deal damage, you can deal Bludgeoning damage equal to 1d4 plus your Strength modifier, instead of the normal damage of an Unarmed Strike.',
      'Damage Rerolls. Whenever you roll a damage die for your Unarmed Strike, you can reroll the die if it rolls a 1, and you must use the new roll.',
      'Shove. When you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you can deal damage to the target and also push it 5 feet away. You can use this benefit only once per turn.',
      'Furniture as Weapons. You can wield furniture as a Simple Melee weapon. A Medium or smaller piece of furniture deals 1d6 Bludgeoning damage, and a Large or larger one deals 1d10 Bludgeoning damage.',
    ],
  },
  {
    id: 'tough',
    name: 'Tough',
    category: 'origin',
    description: 'Your hit point maximum increases by an amount equal to twice your character level when you gain this feat. Whenever you gain a character level thereafter, your hit point maximum increases by an additional 2 hit points.',
    benefits: [
      'Your Hit Point maximum increases by an amount equal to twice your character level when you gain this feat.',
      'Whenever you gain a character level thereafter, your Hit Point maximum increases by an additional 2 Hit Points.',
    ],
  },
];

export const ALL_FEATS: Feat[] = [...ORIGIN_FEATS];

export const FEATS_MAP: Record<string, Feat> = Object.fromEntries(
  ALL_FEATS.map((f) => [f.id, f]),
);
