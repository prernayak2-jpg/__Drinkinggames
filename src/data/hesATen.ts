// He's a 10 but…: trait cards grouped by the number they should bring a 10 down to.
// Traits are written with tokens so they work for He, She or They:
//   {s} he/she/they  {o} him/her/them  {p} his/her/their  {self} himself/herself/themselves
//   {guys} guys/girls/people  [x|y] verb form for he/she (x) or they (y)

export type Subject = 'he' | 'she' | 'they'

export type Band = { label: string; min: number; max: number; traits: string[] }

export const subjects: Record<Subject, { label: string; title: string }> = {
  he: { label: 'He', title: "He's" },
  she: { label: 'She', title: "She's" },
  they: { label: 'They', title: "They're" },
}

const pronouns: Record<Subject, Record<string, string>> = {
  he: { s: 'he', o: 'him', p: 'his', self: 'himself', guys: 'guys' },
  she: { s: 'she', o: 'her', p: 'her', self: 'herself', guys: 'girls' },
  they: { s: 'they', o: 'them', p: 'their', self: 'themselves', guys: 'people' },
}

/** Fill in a trait's pronouns and verbs for the chosen subject. */
export function renderTrait(trait: string, subject: Subject) {
  return trait
    .replace(/\{(\w+)\}/g, (_, token: string) => pronouns[subject][token])
    .replace(/\[([^|\]]*)\|([^\]]*)\]/g, (_, single: string, plural: string) =>
      subject === 'they' ? plural : single,
    )
}

export const bands: Band[] = [
  {
    label: 'Not even a flaw',
    min: 10,
    max: 10,
    traits: [
      '{s} [cooks|cook] you breakfast every weekend',
      '{s} [remembers|remember] your coffee order after one date',
      '{s} [texts|text] back within five minutes',
      '{s} [is|are] too good at giving gifts',
      '{s} [plans|plan] every date and [pays|pay] for the snacks',
      '{s} [is|are] nice to literally everyone',
      '{s} [has|have] a dog that loves you more than {o}',
      '{s} [knows|know] all the words to your favourite song',
      '{s} [makes|make] your friends laugh more than you do',
      '{s} [is|are] annoyingly good at every sport',
      "{s} [gives|give] the best hugs, and it's distracting",
      '{s} [calls|call] {p} grandma every Sunday',
    ],
  },
  {
    label: 'Tiny dent',
    min: 8,
    max: 9,
    traits: [
      '{s} [is|are] always 10 minutes late',
      '{s} [laughs|laugh] at {p} own jokes first',
      '{s} [takes|take] an hour to pick a restaurant',
      '{s} [uses|use] way too many emojis',
      '{s} never [has|have] phone battery',
      '{s} [hums|hum] while {s} [eats|eat]',
      '{s} [starts|start] every sentence with “no offence but”',
      '{s} [leaves|leave] one sip in the bottle',
      '{s} [takes|take] a photo of every meal before you can eat',
      '{s} [replies|reply] “k” to everything',
      '{s} [puts|put] pineapple on pizza',
      '{s} [sings|sing] in the shower, badly',
      '{s} [claps|clap] when the plane lands',
      '{s} [has|have] 4,000 unread emails',
      '{s} [falls|fall] asleep during every movie',
      '{s} [steals|steal] the blanket at night',
      '{s} [says|say] “literally” every other word',
      '{s} [walks|walk] really, really slowly',
      '{s} [has|have] a very loud sneeze',
      '{s} [watches|watch] the same show on repeat',
      '{s} [double-texts|double-text] “hello??” after two minutes',
      '{s} [is|are] scared of pigeons',
    ],
  },
  {
    label: 'Annoying',
    min: 5,
    max: 7,
    traits: [
      '{s} [talks|talk] about {p} ex on the first date',
      '{s} [splits|split] the bill by item',
      '{s} [calls|call] {self} an alpha',
      '{s} [is|are] rude to waiters',
      '{s} [has|have] a podcast nobody asked for',
      '{s} [leaves|leave] you on read for days, then [sends|send] a meme',
      '{s} only [talks|talk] about crypto',
      '{s} [reads|read] out your texts to {p} friends',
      '{s} still [lets|let] {p} mum do {p} laundry',
      '{s} [takes|take] your fries without asking',
      "{s} [explains|explain] movies while you're watching them",
      '{s} [chews|chew] ice really loudly',
      '{s} [has|have] a gym selfie as every profile picture',
      '{s} [corrects|correct] your grammar in texts',
      '{s} [plays|play] music out loud on public transport',
      '{s} [brings|bring] up {p} star sign in every argument',
      '{s} [answers|answer] every question with a question',
      '{s} [keeps|keep] {p} shoes on in the house',
      '{s} [has|have] never washed a mug',
      '{s} [films|film] every concert instead of watching it',
      '{s} [calls|call] you “bro” on dates',
      '{s} [is|are] on {p} phone the whole date',
    ],
  },
  {
    label: 'Rough',
    min: 3,
    max: 4,
    traits: [
      '{s} [says|say] “I’m not like other {guys}” in the first five minutes',
      '{s} [is|are] still in {p} ex’s family group chat',
      '{s} [checks|check] {p} reflection in every shiny surface',
      '{s} [proposes|propose] after two weeks',
      '{s} [is|are] sweet to you and mean to {p} mum',
      '{s} [lies|lie] about small things for no reason',
      '{s} [brings|bring] a friend on the date and never [mentions|mention] it',
      '{s} [rates|rate] every person {s} [walks|walk] past out loud',
      '{s} [corrects|correct] your pronunciation in public',
      '{s} [tells|tell] your secrets as jokes',
      '{s} [has|have] a shrine to {p} ex',
      '{s} [borrows|borrow] money and never [pays|pay] it back',
      "{s} [goes|go] through your phone when you're asleep",
      '{s} [lets|let] {p} mum choose {p} dates',
      "{s} [hasn't|haven't] changed {p} sheets since last year",
      '{s} [cheats|cheat] at board games, every time',
      '{s} [ghosts|ghost] {p} friends after every argument',
      '{s} [puts|put] you on speaker without telling you',
      '{s} [tracks|track] your location “just in case”',
      '{s} [takes|take] credit for your jokes',
      '{s} [has|have] never said sorry, not once',
      '{s} [brings|bring] {p} laptop on holiday to work',
    ],
  },
  {
    label: 'Disaster',
    min: 1,
    max: 2,
    traits: [
      '{s} [is|are] “separated” but still married',
      '{s} [screams|scream] at the referee at kids’ matches',
      '{s} [reads|read] your diary and [quotes|quote] it',
      '{s} [steals|steal] from the tip jar',
      '{s} [flirts|flirt] with your sibling',
      '{s} [keeps|keep] a list of your flaws',
      '{s} only [dates|date] people who pay for everything',
      '{s} [says|say] your name wrong on purpose',
      '{s} [cancels|cancel] plans and [posts|post] from the same party',
      '{s} [calls|call] {p} mum on dates and [chews|chew] with {p} mouth open',
      '{s} [has|have] a secret second family',
      '{s} [hates|hate] dogs',
      '{s} [is|are] wanted in three countries',
      '{s} proposed to {p} ex at your birthday party',
      "{s} [sells|sell] your stuff online while you're at work",
      '{s} brought {p} mum on your honeymoon',
      '{s} [uses|use] your toothbrush',
      '{s} [laughs|laugh] when people cry',
      '{s} [forgets|forget] your name after a year together',
      '{s} [records|record] your arguments to post online',
      '{s} [blames|blame] you for everything, even the weather',
      '{s} [thinks|think] showering is optional',
    ],
  },
]

export function bandFor(number: number) {
  return bands.find((b) => number >= b.min && number <= b.max)!
}
