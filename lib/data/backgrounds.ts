import type { Ability } from '../types';

export interface BackgroundASI {
  /** The three ability scores this background's bonuses are distributed among.
   *  Player chooses: +2 to one + +1 to another, OR +1 to all three. */
  abilities: [Ability, Ability, Ability];
}

export interface Background {
  id: string;
  name: string;
  description: string;
  abilityScoreIncreases: BackgroundASI;
  originFeatId: string;
  skillProficiencies: [string, string];
  toolProficiency?: string;
  languageProficiency?: string;
  feature: { name: string; description: string };
}

export const BACKGROUNDS: Background[] = [
  {
    id: 'acolyte',
    name: 'Acolyte',
    description: 'You have spent your life in service to a temple, learning sacred rites and providing sanctified support to worshipers.',
    abilityScoreIncreases: { abilities: ['int', 'wis', 'cha'] },
    originFeatId: 'magic-initiate',
    skillProficiencies: ['insight', 'religion'],
    languageProficiency: 'Two languages of your choice',
    feature: {
      name: 'Shelter of the Faithful',
      description: 'As an acolyte, you command the respect of those who share your faith. You and your companions can receive free healing and care at a temple, shrine, or other established presence of your faith.',
    },
  },
  {
    id: 'artisan',
    name: 'Artisan',
    description: 'You have spent years learning the skills of a master artisan, developing expertise in creating and repairing goods.',
    abilityScoreIncreases: { abilities: ['str', 'dex', 'int'] },
    originFeatId: 'crafter',
    skillProficiencies: ['investigation', 'persuasion'],
    toolProficiency: 'One type of Artisan\'s Tools of your choice',
    feature: {
      name: 'Artisan\'s Eye',
      description: 'With a moment\'s inspection, you can determine the quality and approximate value of goods and know if they are counterfeits or forgeries.',
    },
  },
  {
    id: 'charlatan',
    name: 'Charlatan',
    description: 'You have always had a way with people — knowing what they want to hear and how to get them to believe it.',
    abilityScoreIncreases: { abilities: ['dex', 'con', 'cha'] },
    originFeatId: 'skilled',
    skillProficiencies: ['deception', 'sleight-of-hand'],
    toolProficiency: 'Forgery Kit',
    feature: {
      name: 'False Identity',
      description: 'You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona.',
    },
  },
  {
    id: 'criminal',
    name: 'Criminal',
    description: 'You are an experienced criminal with a history of breaking the law. Your time spent on the shady side of society has taught you many useful skills.',
    abilityScoreIncreases: { abilities: ['dex', 'con', 'int'] },
    originFeatId: 'alert',
    skillProficiencies: ['deception', 'stealth'],
    toolProficiency: 'Thieves\' Tools',
    feature: {
      name: 'Criminal Contact',
      description: 'You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals.',
    },
  },
  {
    id: 'entertainer',
    name: 'Entertainer',
    description: 'You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them.',
    abilityScoreIncreases: { abilities: ['str', 'dex', 'cha'] },
    originFeatId: 'tavern-brawler',
    skillProficiencies: ['acrobatics', 'performance'],
    toolProficiency: 'One type of Musical Instrument of your choice',
    feature: {
      name: 'By Popular Demand',
      description: 'You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble\'s court. In exchange for your performance, you receive free lodging and food.',
    },
  },
  {
    id: 'farmer',
    name: 'Farmer',
    description: 'You grew up connected to the land, working fields and tending animals. Hard work and perseverance are values you learned early.',
    abilityScoreIncreases: { abilities: ['str', 'con', 'wis'] },
    originFeatId: 'tough',
    skillProficiencies: ['animal-handling', 'nature'],
    toolProficiency: 'Carpenter\'s Tools',
    feature: {
      name: 'Tiller\'s Know-How',
      description: 'You know how to identify fertile land, forecast weather, and find natural shelter when needed.',
    },
  },
  {
    id: 'guard',
    name: 'Guard',
    description: 'Your training focused on standing watch and protecting something — a person, a place, or a caravan. You are accustomed to vigilance and routine.',
    abilityScoreIncreases: { abilities: ['str', 'int', 'wis'] },
    originFeatId: 'alert',
    skillProficiencies: ['athletics', 'perception'],
    toolProficiency: 'Gaming Set of your choice',
    feature: {
      name: 'Watcher\'s Eye',
      description: 'Your experience in enforcing the law or guarding key locations grants you knowledge of criminal networks and safe houses in any city you visit.',
    },
  },
  {
    id: 'guide',
    name: 'Guide',
    description: 'You grew up in the wilderness, learning to navigate difficult terrain and survive far from civilization.',
    abilityScoreIncreases: { abilities: ['dex', 'con', 'wis'] },
    originFeatId: 'magic-initiate',
    skillProficiencies: ['stealth', 'survival'],
    toolProficiency: 'Cartographer\'s Tools',
    feature: {
      name: 'Wanderer',
      description: 'You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you.',
    },
  },
  {
    id: 'hermit',
    name: 'Hermit',
    description: 'You lived in seclusion for a formative part of your life. Solitude and contemplation gave you unique insight into nature or the divine.',
    abilityScoreIncreases: { abilities: ['con', 'int', 'wis'] },
    originFeatId: 'magic-initiate',
    skillProficiencies: ['medicine', 'religion'],
    toolProficiency: 'Herbalism Kit',
    feature: {
      name: 'Discovery',
      description: 'The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery — a great truth about the cosmos, the deities, the powerful beings of the outer planes, or the forces of nature.',
    },
  },
  {
    id: 'merchant',
    name: 'Merchant',
    description: 'You spent years working as a merchant or trading with others, learning the value of goods and the art of negotiation.',
    abilityScoreIncreases: { abilities: ['con', 'int', 'cha'] },
    originFeatId: 'lucky',
    skillProficiencies: ['insight', 'persuasion'],
    toolProficiency: 'Navigator\'s Tools',
    feature: {
      name: 'Trade Connections',
      description: 'You have connections to merchant networks and know reliable trade contacts in most major cities who can help you find buyers or sellers for goods.',
    },
  },
  {
    id: 'noble',
    name: 'Noble',
    description: 'You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields significant political influence.',
    abilityScoreIncreases: { abilities: ['int', 'wis', 'cha'] },
    originFeatId: 'skilled',
    skillProficiencies: ['history', 'persuasion'],
    toolProficiency: 'Gaming Set of your choice',
    languageProficiency: 'One language of your choice',
    feature: {
      name: 'Position of Privilege',
      description: 'Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are.',
    },
  },
  {
    id: 'sage',
    name: 'Sage',
    description: 'You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you.',
    abilityScoreIncreases: { abilities: ['con', 'int', 'wis'] },
    originFeatId: 'magic-initiate',
    skillProficiencies: ['arcana', 'history'],
    languageProficiency: 'Two languages of your choice',
    feature: {
      name: 'Researcher',
      description: 'When you attempt to learn or recall a piece of lore, if you don\'t know the information, you often know where and from whom you can obtain it.',
    },
  },
  {
    id: 'sailor',
    name: 'Sailor',
    description: 'You sailed on a seagoing vessel for years. In that time, you faced down mighty storms, monsters of the deep, and those who wanted to sink your craft to the bottomless depths.',
    abilityScoreIncreases: { abilities: ['str', 'dex', 'wis'] },
    originFeatId: 'tavern-brawler',
    skillProficiencies: ['athletics', 'perception'],
    toolProficiency: 'Navigator\'s Tools',
    feature: {
      name: 'Ship\'s Passage',
      description: 'When you need to, you can secure free passage on a sailing ship for yourself and your companions. You might sail on the ship you served on, or another ship you have relations with.',
    },
  },
  {
    id: 'scribe',
    name: 'Scribe',
    description: 'You spent formative years in a scriptorium, chronicling knowledge for posterity and perfecting the craft of writing.',
    abilityScoreIncreases: { abilities: ['dex', 'int', 'wis'] },
    originFeatId: 'skilled',
    skillProficiencies: ['investigation', 'perception'],
    toolProficiency: 'Calligrapher\'s Supplies',
    languageProficiency: 'One language of your choice',
    feature: {
      name: 'Fast Writer',
      description: 'You can copy documents, maps, and other written materials much faster than average, completing in minutes work that would take others hours.',
    },
  },
  {
    id: 'soldier',
    name: 'Soldier',
    description: 'War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, including how to stay alive on the battlefield.',
    abilityScoreIncreases: { abilities: ['str', 'dex', 'con'] },
    originFeatId: 'savage-attacker',
    skillProficiencies: ['athletics', 'intimidation'],
    toolProficiency: 'Gaming Set of your choice',
    feature: {
      name: 'Military Rank',
      description: 'You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence.',
    },
  },
  {
    id: 'wayfarer',
    name: 'Wayfarer',
    description: 'You grew up among people who had no fixed home, traveling as the seasons changed, following game and fertile land.',
    abilityScoreIncreases: { abilities: ['dex', 'wis', 'cha'] },
    originFeatId: 'lucky',
    skillProficiencies: ['insight', 'stealth'],
    toolProficiency: 'Thieves\' Tools',
    feature: {
      name: 'Drifter\'s Luck',
      description: 'You are never truly lost. You can always retrace your path back to where you came from, and you know how to find shelter, water, and food in the wilderness.',
    },
  },
];

export const BACKGROUNDS_MAP: Record<string, Background> = Object.fromEntries(
  BACKGROUNDS.map((b) => [b.id, b]),
);
