export interface SpeciesTrait {
  name: string;
  description: string;
}

export interface Species {
  id: string;
  name: string;
  size: 'Small' | 'Medium' | 'Large';
  speed: number;
  languages: string[];
  traits: SpeciesTrait[];
}

export const SPECIES: Species[] = [
  {
    id: 'aasimar',
    name: 'Aasimar',
    size: 'Medium',
    speed: 30,
    languages: ['Common', 'Celestial'],
    traits: [
      {
        name: 'Celestial Resistance',
        description: 'You have Resistance to Necrotic damage and Radiant damage.',
      },
      {
        name: 'Darkvision',
        description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray.',
      },
      {
        name: 'Healing Hands',
        description: 'As a Magic action, you can touch a creature and roll a number of d4s equal to your Proficiency Bonus. The creature regains a number of Hit Points equal to the total rolled. Once you use this trait, you can\'t use it again until you finish a Long Rest.',
      },
      {
        name: 'Light Bearer',
        description: 'You know the Light cantrip. Charisma is your spellcasting ability for it.',
      },
      {
        name: 'Celestial Revelation',
        description: 'When you reach character level 3, you can transform as a Bonus Action using one of the options below (choose the option each time). The transformation lasts for 1 minute or until you end it (no action required). Once you use this trait, you can\'t use it again until you finish a Long Rest.\n\nNecromantic Shroud: Necrotic energy radiates from you, extending 10 feet from you. Enemies who start their turn within range make a Charisma saving throw (DC = 8 + your Charisma modifier + your Proficiency Bonus), becoming Frightened until the start of their next turn on a failed save. Once per turn when you deal damage, add 1d10 Necrotic damage.\n\nRadiant Consumption: Luminous flames erupt from you, extending 10 feet from you. Enemies who start their turn within range take 1d10 Radiant damage. Once per turn when you deal damage, add 1d10 Radiant damage.\n\nRadiant Soul: Two luminous, spectral wings sprout from your back. You have a Fly Speed equal to your Speed. Once per turn when you deal damage, add 1d10 Radiant damage.',
      },
    ],
  },
  {
    id: 'dragonborn',
    name: 'Dragonborn',
    size: 'Medium',
    speed: 30,
    languages: ['Common', 'Draconic'],
    traits: [
      {
        name: 'Draconic Ancestry',
        description: 'Your lineage stems from a dragon progenitor. Choose the kind of dragon from the Draconic Ancestor table. Your choice affects your Breath Weapon and Damage Resistance traits.',
      },
      {
        name: 'Breath Weapon',
        description: 'When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in either a 15-foot Cone or a 30-foot Line (your choice). Each creature in that area must make a Dexterity saving throw (DC = 8 + your Constitution modifier + your Proficiency Bonus). On a failed save, the creature takes 1d10 damage of the type determined by your Draconic Ancestry trait. On a successful save, the creature takes half as much damage. This damage increases by 1d10 when you reach character levels 5 (2d10), 11 (3d10), and 17 (4d10). You can use your Breath Weapon a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
      },
      {
        name: 'Damage Resistance',
        description: 'You have Resistance to the damage type associated with your Draconic Ancestry.',
      },
      {
        name: 'Darkvision',
        description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray.',
      },
      {
        name: 'Draconic Flight',
        description: 'When you reach character level 5, you sprout draconic wings. As a Bonus Action, you can cause the wings to appear and gain a Fly Speed equal to your Speed. The wings last until you dismiss them as a Bonus Action or you have the Incapacitated condition.',
      },
    ],
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    size: 'Medium',
    speed: 30,
    languages: ['Common', 'Dwarvish'],
    traits: [
      {
        name: 'Darkvision',
        description: 'You can see in dim light within 120 feet of you as if it were bright light, and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray.',
      },
      {
        name: 'Dwarven Resilience',
        description: 'You have Resistance to Poison damage. You also have Advantage on saving throws you make to avoid or end the Poisoned condition.',
      },
      {
        name: 'Dwarven Toughness',
        description: 'Your Hit Point maximum increases by 1, and it increases by 1 again whenever you gain a level.',
      },
      {
        name: 'Stonecunning',
        description: 'As a Bonus Action, you gain Tremorsense with a range of 60 feet for 10 minutes. You must be on a stone surface or touching a stone surface to use this Tremorsense. You can use this Bonus Action a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
      },
    ],
  },
  {
    id: 'elf',
    name: 'Elf',
    size: 'Medium',
    speed: 30,
    languages: ['Common', 'Elvish'],
    traits: [
      {
        name: 'Darkvision',
        description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray.',
      },
      {
        name: 'Elven Lineage',
        description: 'You are part of one of the elven lineages: Drow (Drow Magic), High Elf (High Elf Cantrip), or Wood Elf (Wood Elf Speed). Your choice grants you additional traits at levels 3 and 5.',
      },
      {
        name: 'Fey Ancestry',
        description: 'You have Advantage on saving throws you make to avoid or end the Charmed condition.',
      },
      {
        name: 'Keen Senses',
        description: 'You have proficiency in the Insight, Perception, or Survival skill (choose one when you select this species).',
      },
      {
        name: 'Trance',
        description: 'You don\'t need to sleep, and magic can\'t put you to sleep. You can finish a Long Rest in 4 hours if you spend those hours in a trancelike meditation, during which you retain consciousness.',
      },
    ],
  },
  {
    id: 'gnome',
    name: 'Gnome',
    size: 'Small',
    speed: 30,
    languages: ['Common', 'Gnomish'],
    traits: [
      {
        name: 'Darkvision',
        description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray.',
      },
      {
        name: 'Gnomish Cunning',
        description: 'You have Advantage on Intelligence, Wisdom, and Charisma saving throws.',
      },
      {
        name: 'Gnomish Lineage',
        description: 'You are part of one of the gnomish lineages: Forest Gnome (Minor Illusion cantrip + Speak with Animals) or Rock Gnome (Mending + Prestidigitation + Tinker proficiency).',
      },
    ],
  },
  {
    id: 'goliath',
    name: 'Goliath',
    size: 'Medium',
    speed: 35,
    languages: ['Common', 'Giant'],
    traits: [
      {
        name: 'Giant Ancestry',
        description: 'You are descended from Giants. Choose one of the following benefits; you can use it a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest:\n\nCloud\'s Jaunt (Cloud Giant): As a Bonus Action, you magically teleport up to 30 feet to an unoccupied space you can see.\n\nFire\'s Burn (Fire Giant): When you hit a target with an attack roll and deal damage, you can also deal 1d10 Fire damage to that target.\n\nFrost\'s Chill (Frost Giant): When you hit a target with an attack roll and deal damage, you can also deal 1d6 Cold damage to that target and reduce its Speed by 10 feet until the start of your next turn.\n\nHill\'s Tumble (Hill Giant): When you hit a Large or smaller creature with an attack roll and deal damage, you can give that target the Prone condition.\n\nStone\'s Endurance (Stone Giant): When you take damage, you can take a Reaction to roll 1d12. Add your Constitution modifier to the number rolled and reduce the damage by that total.\n\nStorm\'s Thunder (Storm Giant): When you take damage from a creature within 60 feet of you, you can take a Reaction to deal 1d8 Thunder damage to that creature.',
      },
      {
        name: 'Large Form',
        description: 'Starting at character level 5, you can change your size to Large as a Bonus Action if you\'re in a big enough space. This transformation lasts for 10 minutes or until you end it (no action required). During it, you have Advantage on Strength checks, and your Speed increases by 10 feet. Once you use this trait, you can\'t use it again until you finish a Long Rest.',
      },
      {
        name: 'Powerful Build',
        description: 'You have Advantage on any saving throw you make to end the Grappled condition. You also count as one size larger when determining your carrying capacity.',
      },
    ],
  },
  {
    id: 'halfling',
    name: 'Halfling',
    size: 'Small',
    speed: 30,
    languages: ['Common'],
    traits: [
      {
        name: 'Brave',
        description: 'You have Advantage on saving throws you make to avoid or end the Frightened condition.',
      },
      {
        name: 'Halfling Nimbleness',
        description: 'You can move through the space of any creature that is a size larger than you, but you can\'t stop in the same space.',
      },
      {
        name: 'Luck',
        description: 'When you roll a 1 on the d20 for a d20 Test, you can reroll the die, and you must use the new roll.',
      },
      {
        name: 'Naturally Stealthy',
        description: 'You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you.',
      },
    ],
  },
  {
    id: 'human',
    name: 'Human',
    size: 'Medium',
    speed: 30,
    languages: ['Common', 'One additional language of your choice'],
    traits: [
      {
        name: 'Resourceful',
        description: 'You gain Heroic Inspiration whenever you finish a Long Rest.',
      },
      {
        name: 'Skillful',
        description: 'You gain proficiency in one skill of your choice.',
      },
      {
        name: 'Versatile',
        description: 'You gain an Origin feat of your choice. See the Feats chapter for possible feats. Consult your DM before taking a feat that\'s not in this book.',
      },
    ],
  },
  {
    id: 'orc',
    name: 'Orc',
    size: 'Medium',
    speed: 30,
    languages: ['Common', 'Orc'],
    traits: [
      {
        name: 'Adrenaline Rush',
        description: 'You can take the Dash action as a Bonus Action. When you do so, you gain a number of Temporary Hit Points equal to your Proficiency Bonus. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Short or Long Rest.',
      },
      {
        name: 'Darkvision',
        description: 'You can see in dim light within 120 feet of you as if it were bright light, and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray.',
      },
      {
        name: 'Relentless Endurance',
        description: 'When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once you use this trait, you can\'t do so again until you finish a Long Rest.',
      },
    ],
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    size: 'Medium',
    speed: 30,
    languages: ['Common', 'Infernal'],
    traits: [
      {
        name: 'Darkvision',
        description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray.',
      },
      {
        name: 'Fiendish Legacy',
        description: 'You are the recipient of a legacy that grants you supernatural abilities. Choose a legacy from the Fiendish Legacies table. You gain the level 1 benefit of the chosen legacy.\n\nAbyssal (Chaotic Evil): Resistance to Poison damage. At level 3: Ray of Sickness (Wisdom). At level 5: Hold Person (Wisdom).\n\nChthonic (Neutral Evil): Resistance to Necrotic damage. At level 3: False Life (Wisdom). At level 5: Ray of Enfeeblement (Wisdom).\n\nInfernal (Lawful Evil): Resistance to Fire damage. At level 3: Hellish Rebuke (Charisma). At level 5: Darkness (Charisma).',
      },
      {
        name: 'Otherworldly Presence',
        description: 'You know the Thaumaturgy cantrip. When you cast it with this trait, the spell uses Charisma as the spellcasting ability.',
      },
    ],
  },
];

export const SPECIES_MAP: Record<string, Species> = Object.fromEntries(
  SPECIES.map((s) => [s.id, s]),
);
