// "What are you bringing to the party?": the secret rules the host judges items against.
// Each rule has a one-line judging check, two Yes and two No sample items,
// and three hints from vague to almost obvious.

export type Level = 'easy' | 'medium' | 'hard'

/** Extra info the host card shows to help judge rules that depend on the table. */
export type Helper = 'neighbour' | 'ownName' | 'previousItem'

export type PartyRule = {
  level: Level
  rule: string
  judge: string
  yes: [string, string]
  no: [string, string]
  hints: [string, string, string]
  helper?: Helper
}

export const levels: Record<Level, { label: string; emoji: string }> = {
  easy: { label: 'Easy', emoji: '🟢' },
  medium: { label: 'Medium', emoji: '🟡' },
  hard: { label: 'Hard', emoji: '🔴' },
}

export const levelOrder: Level[] = ['easy', 'medium', 'hard']

export const partyRules: PartyRule[] = [
  // Easy
  {
    level: 'easy',
    rule: 'Items must start with the letter A.',
    judge: 'Does the item start with A?',
    yes: ['Apples', 'An air mattress'],
    no: ['Bananas', 'A pillow'],
    hints: [
      "It's all about how the word looks.",
      'Look at the very first letter.',
      "It's the first letter of the alphabet.",
    ],
  },
  {
    level: 'easy',
    rule: 'Items must be something you can eat.',
    judge: 'Could you eat it?',
    yes: ['Pizza', 'Chocolate'],
    no: ['A speaker', 'Sunglasses'],
    hints: [
      'Think about what the party will need later.',
      'Your stomach would approve.',
      'If you can eat it, you can bring it.',
    ],
  },
  {
    level: 'easy',
    rule: 'Items must be red.',
    judge: 'Is the item usually red?',
    yes: ['Strawberries', 'A fire truck'],
    no: ['Bananas', 'Grass'],
    hints: ["It's about what the item looks like.", 'Think colours.', 'Think tomatoes, roses and ketchup.'],
  },
  {
    level: 'easy',
    rule: 'Items must have wheels.',
    judge: 'Does it have wheels?',
    yes: ['A skateboard', 'A suitcase on wheels'],
    no: ['A sofa', 'A cake'],
    hints: ["It's about how the item moves.", 'It can roll.', 'Count the wheels.'],
  },
  {
    level: 'easy',
    rule: "Items must be something you'd find in a kitchen.",
    judge: 'Would you normally find it in a kitchen?',
    yes: ['A frying pan', 'A toaster'],
    no: ['A toothbrush', 'A pillow'],
    hints: ["It's about where the item lives.", 'Think of one room in the house.', "It's where you cook."],
  },
  {
    level: 'easy',
    rule: 'Items must be animals.',
    judge: 'Is it an animal?',
    yes: ['A puppy', 'A parrot'],
    no: ['A balloon', 'A guitar'],
    hints: ['These guests are alive.', 'They might need feeding.', 'Think of a zoo.'],
  },
  {
    level: 'easy',
    rule: 'Items must be cold.',
    judge: 'Is it usually cold?',
    yes: ['Ice cream', 'Ice cubes'],
    no: ['Hot chocolate', 'A candle'],
    hints: ["It's about how the item feels.", 'Think about temperature.', 'You might find it in a freezer.'],
  },
  {
    level: 'easy',
    rule: 'Items must start with the letter S.',
    judge: 'Does the item start with S?',
    yes: ['Snacks', 'Sunglasses'],
    no: ['Chips', 'A hat'],
    hints: [
      "It's all about how the word looks.",
      'Look at the very first letter.',
      "It's the letter that makes a hissing sound.",
    ],
  },
  {
    level: 'easy',
    rule: 'Items must be something you can wear.',
    judge: 'Can you wear it?',
    yes: ['A hat', 'Sneakers'],
    no: ['A pizza', 'A chair'],
    hints: ['Think about getting ready.', 'It goes on your body.', 'Check your wardrobe.'],
  },
  {
    level: 'easy',
    rule: 'Items must be something that needs batteries or a plug.',
    judge: 'Does it need power to work?',
    yes: ['A speaker', 'A hair dryer'],
    no: ['A book', 'A blanket'],
    hints: ["It's about how the item works.", "It won't work on its own.", 'It needs electricity.'],
  },

  // Medium
  {
    level: 'medium',
    rule: 'Items must start with the first letter of the name of the person sitting next to you.',
    judge: "Does the item start with the first letter of the next player's name?",
    yes: ['Mangoes (next to Maya)', 'Rum (next to Rohan)'],
    no: ['Apples (next to Maya)', 'Snacks (next to Rohan)'],
    hints: [
      "It's about who you're sitting with.",
      'Look at the person next to you.',
      "Their name holds the key, especially how it starts.",
    ],
    helper: 'neighbour',
  },
  {
    level: 'medium',
    rule: 'Items must start with the first letter of your own name.',
    judge: "Does the item start with the same letter as the speaker's name?",
    yes: ['Pizza (Priya)', 'Jelly (Jay)'],
    no: ['Cake (Priya)', 'Bread (Jay)'],
    hints: ["It's about who is speaking.", "You've known the answer since you were born.", 'Think about your own name.'],
    helper: 'ownName',
  },
  {
    level: 'medium',
    rule: 'Items must have a double letter in them.',
    judge: 'Does the word have the same letter twice in a row?',
    yes: ['Coffee', 'Balloons'],
    no: ['Tea', 'Cake'],
    hints: ["It's about how the word is spelled.", 'Some letters like company.', 'Look for twins in the spelling.'],
  },
  {
    level: 'medium',
    rule: 'Items must be compound words (two words joined together).',
    judge: 'Is it two words stuck together?',
    yes: ['Cupcakes', 'Sunglasses'],
    no: ['Cookies', 'Glasses'],
    hints: ["It's about how the word is built.", 'Some words are made of smaller words.', 'Two words, one item.'],
  },
  {
    level: 'medium',
    rule: 'Items must end with the letter E.',
    judge: 'Does the word end in E?',
    yes: ['Cake', 'Cheese'],
    no: ['Chips', 'Pizza'],
    hints: ["It's about how the word is spelled.", 'Look at the end, not the start.', "It's the most common letter in English."],
  },
  {
    level: 'medium',
    rule: 'Items must come in pairs.',
    judge: 'Does it usually come as a pair?',
    yes: ['Shoes', 'Earrings'],
    no: ['A hat', 'A watch'],
    hints: ["It's about how many you'd bring.", 'One is never enough.', 'Think of things that come in twos.'],
  },
  {
    level: 'medium',
    rule: 'Items must have exactly three letters.',
    judge: 'Is the word exactly three letters long?',
    yes: ['Gum', 'A hat'],
    no: ['Cake', 'Chips'],
    hints: ["It's about the length of the word.", 'Keep it short.', 'Count the letters: fewer than four.'],
  },
  {
    level: 'medium',
    rule: 'Items must be smaller than your hand.',
    judge: 'Would it fit in the palm of your hand?',
    yes: ['A lipstick', 'A key'],
    no: ['A guitar', 'A watermelon'],
    hints: ["It's about size.", 'Think small.', 'It fits in your hand.'],
  },
  {
    level: 'medium',
    rule: 'Items must contain the letter O.',
    judge: 'Is there an O anywhere in the word?',
    yes: ['Popcorn', 'Lemonade'],
    no: ['Chips', 'Cake'],
    hints: ["It's about how the word is spelled.", 'One letter has to be in there somewhere.', "It's round, like a zero."],
  },
  {
    level: 'medium',
    rule: 'Items must be plural (more than one of something).',
    judge: 'Did they say more than one of the thing?',
    yes: ['Balloons', 'Cupcakes'],
    no: ['A balloon', 'A cupcake'],
    hints: ["It's about how you say it.", 'The more the merrier.', 'Bring lots of them, not just one.'],
  },

  // Hard
  {
    level: 'hard',
    rule: 'Items must start with the last letter of the previous item.',
    judge: 'Does the item start with the last letter of the item said just before it?',
    yes: ['Cake → Eggs', 'Eggs → Salsa'],
    no: ['Cake → Pizza', 'Eggs → Ham'],
    hints: [
      "It's about what was said before you.",
      'Listen to the last item closely.',
      'Look at how the last item ends.',
    ],
    helper: 'previousItem',
  },
  {
    level: 'hard',
    rule: 'Items must not contain the letter E.',
    judge: 'Is there no E anywhere in the word?',
    yes: ['Pizza', 'Chips'],
    no: ['Cake', 'Cheese'],
    hints: [
      "It's about how the word is spelled.",
      'One letter is banned.',
      "The banned letter is the most common one in English.",
    ],
  },
  {
    level: 'hard',
    rule: 'Items must start with the last letter of your own name.',
    judge: "Does the item start with the last letter of the speaker's name?",
    yes: ['Apples (Priya)', 'Yoghurt (Jay)'],
    no: ['Pizza (Priya)', 'Jelly (Jay)'],
    hints: ["It's about who is speaking.", 'Think about your own name.', 'Your name, but backwards.'],
    helper: 'ownName',
  },
  {
    level: 'hard',
    rule: 'Items must have the same number of letters as your name.',
    judge: "Does the word have as many letters as the speaker's name?",
    yes: ['Chips (Priya, 5)', 'Gum (Jay, 3)'],
    no: ['Cake (Priya, 5)', 'Pizza (Jay, 3)'],
    hints: ["It's about who is speaking.", 'Count carefully.', 'Compare the item with your own name.'],
    helper: 'ownName',
  },
  {
    level: 'hard',
    rule: "Items must start with the letter after the previous item's first letter (A, then B, then C…).",
    judge: "Is the first letter one step further in the alphabet than the previous item's?",
    yes: ['Apples → Bread', 'Bread → Cake'],
    no: ['Apples → Cake', 'Bread → Apples'],
    hints: [
      "It's about what was said before you.",
      'Think about an order you learned as a kid.',
      'A, B, C… look at first letters.',
    ],
    helper: 'previousItem',
  },
  {
    level: 'hard',
    rule: 'Anything is allowed, as long as you say "please" in your answer.',
    judge: 'Did they say "please"?',
    yes: ['"Can I bring cake, please?"', '"Please, a speaker"'],
    no: ['"I\'m bringing cake"', '"A speaker"'],
    hints: [
      "It's not about the item at all.",
      "It's about how you ask.",
      'Your manners matter.',
    ],
  },
  {
    level: 'hard',
    rule: 'Anything is allowed, as long as you touch your face while answering.',
    judge: 'Did they touch their face while answering?',
    yes: ['Chips (while scratching their chin)', 'Cake (while touching their nose)'],
    no: ['Chips (hands in lap)', 'Cake (holding a drink)'],
    hints: [
      "It's not about the item at all.",
      'Watch what people do, not what they say.',
      'Look above the shoulders.',
    ],
  },
  {
    level: 'hard',
    rule: 'Items must be things you could not carry alone.',
    judge: 'Would one person struggle to carry it?',
    yes: ['A piano', 'A hot tub'],
    no: ['A cake', 'A speaker'],
    hints: ["It's about size.", 'Think big. Really big.', "You'd need help getting it through the door."],
  },
  {
    level: 'hard',
    rule: 'Items must have more letters than your name.',
    judge: "Does the word have more letters than the speaker's name?",
    yes: ['Lemonade (Jay)', 'Balloons (Priya)'],
    no: ['Gum (Jay)', 'Chips (Priya)'],
    hints: ["It's about who is speaking.", 'Count carefully.', 'Go long, longer than you.'],
    helper: 'ownName',
  },
  {
    level: 'hard',
    rule: 'Anything is allowed, as long as you start your answer with "Um".',
    judge: 'Did their answer start with "Um"?',
    yes: ['"Um, cake"', '"Umm… chips"'],
    no: ['"Cake"', '"Chips, um"'],
    hints: [
      "It's not about the item at all.",
      'Listen to the very start of the answer.',
      'Hesitating is a good thing.',
    ],
  },
]
