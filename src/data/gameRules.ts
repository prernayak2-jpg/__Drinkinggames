// The "how to play" screen shown before each game starts.
// Text adapted from docs/game-instructions.md for playing with the site.

export type GameRules = {
  title: string
  tagline: string
  players: string
  howToPlay: string[]
  rules: string[]
}

export const partyGameRules: GameRules = {
  title: 'What are you bringing to the party?',
  tagline: 'One person secretly sets a rule, and everyone else tries to crack it by guessing what they can bring to the party.',
  players: '4 or more (1 host + 3 or more players)',
  howToPlay: [
    "Enter everyone's names in seating order and pick a level. The first name is the first host.",
    'The host secretly reads the rule on the phone.',
    'The host asks each player in turn, "What are you bringing to the party?" and taps Yes or No for their item.',
    'A No means you drink.',
    'Use the Allowed and Not allowed lists to work out the rule. The host can give hints, but each one costs the host a sip.',
    "Think you've cracked it? Tell the host. Once most players have cracked it, the host reveals the rule, and everyone who didn't crack it drinks.",
    'The host role passes to the next person each round.',
  ],
  rules: [
    'Only the host knows the rule.',
    'The host can give hints, but never says the rule outright.',
    'Example rule: the item must start with the first letter of the name of the person sitting next to you.',
  ],
}

export const sevenElevenGameRules: GameRules = {
  title: '7-11',
  tagline: 'A counting game to 21 where numbers get swapped for new rules, and every mistake means a drink and starting over.',
  players: '3 or more',
  howToPlay: [
    'Sit in a circle and count from 1 to 21, one number per person.',
    'Starting rule: 7 and 11 are swapped. Say "11" when it\'s 7, and "7" when it\'s 11.',
    'If someone makes a mistake, they drink and the next person starts again from 1.',
    'If the group reaches 21 with no mistakes, everyone drinks.',
    'The person who said 21 adds a new rule for another number. Stuck for one? Tap Shuffle to draw one.',
    'Start again from 1 with all the rules in play.',
  ],
  rules: [
    'Rules stack. Every new rule stays for the rest of the game.',
    'Any mistake (wrong number, forgotten action, too slow) means a drink and a restart from 1.',
    'Example new rule: "Instead of saying 4, you clap twice."',
  ],
}
