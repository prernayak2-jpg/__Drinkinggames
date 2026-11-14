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

export const spellBGameRules: GameRules = {
  title: 'Spell B',
  tagline: 'A drunken spelling bee: listen to the word, type it out, and do a drinking dare if you get it wrong.',
  players: '2 or more (no host needed, the site reads the words)',
  howToPlay: [
    "Enter everyone's names and pick a level: Easy, Medium or Hard.",
    'Pass the phone to the first player. The site reads their word out loud.',
    'The player types the spelling and taps Check.',
    'The site says if it’s right or wrong.',
    "If it's right, pass the phone to the next player for a new word.",
    "If it's wrong, the site gives the player a drinking dare to do, then the phone moves on.",
    'Everyone gets 3 words a round. If most words were spelled right, you can move up a level.',
  ],
  rules: [
    'You can replay the word as many times as you like, but no peeking at anyone’s phone for the spelling.',
    'Once you tap Check, your answer is final.',
    'Wrong spelling means you do the dare on screen, no arguing.',
    'Non-drinkers can swap any sip for a sip of water.',
  ],
}

export const hesATenGameRules: GameRules = {
  title: "He's a 10 but…",
  tagline: 'One player guesses the number on their forehead from everyone\'s "He\'s a 10 but…" clues.',
  players: '3 or more (1 guesser + 2 or more clue-givers)',
  howToPlay: [
    "Enter everyone's names, choose He, She or They, and pick a level.",
    'The guesser holds the phone to their forehead with the screen facing the group. A number from 1 to 10 shows on screen.',
    'The clue-giver named on screen says "He\'s a 10 but…" plus a flaw that should bring him down to that number. Trait cards on screen can help.',
    'The guesser says a number, and someone taps Right or Wrong.',
    'Wrong: the clue-giver drinks, and the next player gives a clue.',
    'After 3 wrong guesses, the number is revealed and the guesser drinks.',
    'Right: the phone passes to the next guesser. Once everyone has guessed, you see the drink count and the fastest guesser.',
  ],
  rules: [
    "Clue-givers can't say the number or hint at it with fingers.",
    "The guesser can't look at the screen.",
    'Example: the number is 2 → "He\'s a 10 but he chews with his mouth open and calls his mum during dates."',
  ],
}

export const ickOrNotGameRules: GameRules = {
  title: 'Ick or Not',
  tagline: 'A trait shows up on screen, everyone votes "ick" or "not" at the same time, and everyone who votes ick drinks.',
  players: '3 or more',
  howToPlay: [
    'A trait shows up on screen. Someone reads it out loud.',
    'When everyone has made up their mind, tap Ready to vote.',
    'Count down with the screen: 3, 2, 1, GO!',
    'At GO, everyone votes at the same time: thumbs up for "not", thumbs down for "ick".',
    'Everyone who voted ick drinks.',
    'Tap Next trait for the next one.',
  ],
  rules: [
    'Everyone votes at the same time. No changing your vote.',
    'Defending your vote is encouraged.',
    'Example: "Says \'literally\' in every sentence."',
  ],
}
