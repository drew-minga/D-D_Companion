export interface CantripInfo {
  name: string;
  school: string;
  description: string;
}

export const CANTRIP_DATA: Record<string, CantripInfo> = {
  'Acid Splash':      { name: 'Acid Splash',      school: 'Conjuration',  description: 'Hurl acid at one or two creatures within 60 ft. DEX save or 1d6 acid damage (2d6 at level 5).' },
  'Blade Ward':       { name: 'Blade Ward',        school: 'Abjuration',   description: 'Until end of your next turn, Resistance to Bludgeoning, Piercing, and Slashing damage.' },
  'Chill Touch':      { name: 'Chill Touch',       school: 'Necromancy',   description: 'Ranged spell attack. Hit: 1d10 necrotic damage; target can\'t regain HP until your next turn.' },
  'Dancing Lights':   { name: 'Dancing Lights',    school: 'Illusion',     description: 'Create up to 4 floating lights within 120 ft. Concentration, up to 1 minute.' },
  'Druidcraft':       { name: 'Druidcraft',        school: 'Transmutation',description: 'Minor nature effects: predict weather, make a flower bloom, create harmless sensory effects.' },
  'Eldritch Blast':   { name: 'Eldritch Blast',    school: 'Evocation',    description: 'Ranged spell attack: 1d10 force damage. You fire extra beams at higher levels.' },
  'Elementalism':     { name: 'Elementalism',      school: 'Transmutation',description: 'Minor elemental effects: create a breeze, light/snuff a flame, chill water, shape dirt, etc.' },
  'Fire Bolt':        { name: 'Fire Bolt',         school: 'Evocation',    description: 'Ranged spell attack: 1d10 fire damage. Flammable objects hit ignite.' },
  'Friends':          { name: 'Friends',           school: 'Enchantment',  description: 'Concentration 1 min: Advantage on CHA checks vs one non-hostile creature. They notice magic afterward.' },
  'Guidance':         { name: 'Guidance',          school: 'Divination',   description: 'Touch: creature can add 1d4 to one ability check before the spell ends. Concentration, 1 minute.' },
  'Light':            { name: 'Light',             school: 'Evocation',    description: 'Object emits bright light 20-ft radius, dim light 40 ft. 1 hour, no Concentration.' },
  'Mage Hand':        { name: 'Mage Hand',         school: 'Conjuration',  description: 'Spectral hand within 30 ft. Manipulates objects, opens unlocked doors, carries up to 10 lb.' },
  'Mending':          { name: 'Mending',           school: 'Transmutation',description: 'Repairs a single break or tear in an object (≤ 1 ft). No effect on magic items with charges.' },
  'Message':          { name: 'Message',           school: 'Transmutation',description: 'Whisper a message to a creature within 120 ft. They can reply in a whisper only you hear.' },
  'Minor Illusion':   { name: 'Minor Illusion',    school: 'Illusion',     description: 'Create a sound or small image within 30 ft. INV check against your spell save DC to see through it.' },
  'Poison Spray':     { name: 'Poison Spray',      school: 'Conjuration',  description: '10-ft range: target makes CON save or takes 1d12 poison damage.' },
  'Prestidigitation': { name: 'Prestidigitation',  school: 'Transmutation',description: 'Trivial magic tricks: small effects, clean/soil items, light/snuff candles, chill a drink, etc.' },
  'Produce Flame':    { name: 'Produce Flame',     school: 'Conjuration',  description: 'Flame in your hand sheds light 20 ft. Can hurl it as a ranged spell attack: 1d8 fire damage.' },
  'Ray of Frost':     { name: 'Ray of Frost',      school: 'Evocation',    description: 'Ranged spell attack: 1d8 cold damage and target\'s Speed −10 ft until your next turn.' },
  'Resistance':       { name: 'Resistance',        school: 'Abjuration',   description: 'Touch: creature adds 1d4 to one saving throw before the spell ends. Concentration, 1 minute.' },
  'Sacred Flame':     { name: 'Sacred Flame',      school: 'Evocation',    description: 'Flame descends on a creature you can see. DEX save (no cover bonus) or 1d8 radiant damage.' },
  'Shillelagh':       { name: 'Shillelagh',        school: 'Transmutation',description: 'Club or quarterstaff becomes magical: use WIS for attacks, deals 1d8 damage. 1 minute.' },
  'Shocking Grasp':   { name: 'Shocking Grasp',    school: 'Evocation',    description: 'Melee spell attack: 1d8 lightning damage. Target can\'t take Reactions until its next turn.' },
  'Spare the Dying':  { name: 'Spare the Dying',   school: 'Necromancy',   description: 'Touch a dying creature; it becomes Stable. No effect on Constructs or Undead.' },
  'Thaumaturgy':      { name: 'Thaumaturgy',       school: 'Transmutation',description: 'Minor miracles: amplify voice, make flames flicker, shake the ground, change eye color, etc.' },
  'Thorn Whip':       { name: 'Thorn Whip',        school: 'Transmutation',description: 'Melee spell attack: 1d6 piercing damage. Large or smaller creature is pulled 10 ft toward you.' },
  'Thunderclap':      { name: 'Thunderclap',       school: 'Evocation',    description: 'Audible 100 ft away. Each creature within 5 ft: CON save or 1d6 thunder damage.' },
  'Toll the Dead':    { name: 'Toll the Dead',     school: 'Necromancy',   description: 'A death knell tolls for one creature you can see. WIS save or 1d8 necrotic (1d12 if missing HP).' },
  'True Strike':      { name: 'True Strike',       school: 'Divination',   description: 'Melee or ranged spell attack: 1d6 radiant damage + your spellcasting ability modifier.' },
  'Vicious Mockery':  { name: 'Vicious Mockery',   school: 'Enchantment',  description: 'Insults deal 1d6 psychic damage on a failed WIS save, and target has Disadvantage on its next attack.' },
  'Word of Radiance': { name: 'Word of Radiance',  school: 'Evocation',    description: 'Each chosen creature within 5 ft: CON save or 1d6 radiant damage.' },
};
