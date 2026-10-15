# Flashcards

A simple flashcards SPA built with Svelte 5 + Vite. No backend.

## Running

```sh
npm install
npm run dev
```

## Decks

Each deck is a JSON file in `src/decks/`. Any `*.json` file added there is picked up automatically (the filename becomes the deck id).

```json
{
  "name": "World Capitals",
  "description": "Optional short description.",
  "cards": [
    { "front": "France", "back": "Paris" },
    {
      "front": "Australia",
      "back": "Canberra",
      "details": "Optional longer explanation, shown on the back when the user clicks \"More info\"."
    }
  ]
}
```

Line breaks (`\n`) in `front`, `back` and `details` are preserved.

## Controls

- Click decks to select them, then click "Study selected" to study them together

- Click the card or press Space/Enter to flip
- Click "More info" or press I on the back of a card to toggle its details
- ← / → to move between cards
- Esc to go back to the deck list
