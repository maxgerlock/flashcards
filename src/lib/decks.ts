export interface Card {
  front: string
  back: string
  details?: string
  source?: string
}

export interface Deck {
  id: string
  name: string
  description?: string
  cards: Card[]
}

type DeckFile = Omit<Deck, 'id'>

const modules = import.meta.glob<DeckFile>('../decks/*.json', {
  eager: true,
  import: 'default',
})

export const decks: Deck[] = Object.entries(modules)
  .map(([path, data]) => ({
    id: path.split('/').pop()!.replace(/\.json$/, ''),
    ...data,
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

export function combineDecks(list: Deck[]): Deck {
  if (list.length === 1) return list[0]
  return {
    id: list.map((d) => d.id).join('+'),
    name: `${list.length} decks`,
    cards: list.flatMap((d) => d.cards.map((c) => ({ ...c, source: d.name }))),
  }
}
