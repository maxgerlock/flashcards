<script lang="ts">
  import { combineDecks, decks, type Deck } from './lib/decks'
  import Study from './lib/Study.svelte'

  let studying = $state<Deck | null>(null)
  let checked = $state<string[]>([])

  let checkedDecks = $derived(decks.filter((d) => checked.includes(d.id)))
  let checkedCardCount = $derived(checkedDecks.reduce((n, d) => n + d.cards.length, 0))

  function toggle(id: string) {
    checked = checked.includes(id) ? checked.filter((c) => c !== id) : [...checked, id]
  }

  function toggleAll() {
    checked = checked.length === decks.length ? [] : decks.map((d) => d.id)
  }
</script>

<main>
  {#if studying}
    {#key studying.id}
      <Study deck={studying} onexit={() => (studying = null)} />
    {/key}
  {:else}
    <h1>Flashcards</h1>
    {#if decks.length === 0}
      <p>No decks found. Add a JSON file to <code>src/decks/</code>.</p>
    {:else}
      <div class="toolbar">
        <button class="link" onclick={toggleAll}>
          {checked.length === decks.length ? 'Deselect all' : 'Select all'}
        </button>
        {#if checked.length > 0}
          <span class="count">{checked.length} selected · {checkedCardCount} cards</span>
          <button class="primary" onclick={() => (studying = combineDecks(checkedDecks))}>
            Study selected
          </button>
        {/if}
      </div>

      <ul class="decks">
        {#each decks as deck (deck.id)}
          <li class:checked={checked.includes(deck.id)}>
            <button
              class="tile"
              aria-pressed={checked.includes(deck.id)}
              onclick={() => toggle(deck.id)}
            >
              <strong>{deck.name}</strong>
              {#if deck.description}<span>{deck.description}</span>{/if}
              <small>{deck.cards.length} cards</small>
            </button>
            <input
              type="checkbox"
              tabindex="-1"
              aria-hidden="true"
              checked={checked.includes(deck.id)}
              onchange={() => toggle(deck.id)}
            />
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</main>

<style>
  main {
    max-width: 48rem;
    margin: 0 auto;
    padding: 2rem 1.25rem;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-height: 2.5rem;
  }

  .link {
    background: none;
    border: none;
    color: var(--accent);
    padding: 0.25rem 0;
  }

  .count {
    margin-left: auto;
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .primary {
    background: var(--accent);
    border-color: var(--accent);
    color: white;
  }

  .decks {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    gap: 1rem;
  }

  .decks li {
    position: relative;
    transition: transform 0.15s ease;
  }

  .decks li:hover {
    transform: translateY(-2px);
  }

  .tile {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    padding: 1.25rem 3rem 1.25rem 1.25rem;
    text-align: left;
    background: var(--surface);
    border-radius: 0.75rem;
    box-shadow: 0 2px 10px rgb(0 0 0 / 0.08);
  }

  .checked .tile {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
  }

  .tile span {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .tile small {
    margin-top: auto;
    opacity: 0.6;
  }

  input[type='checkbox'] {
    position: absolute;
    top: 1.1rem;
    right: 1.1rem;
    width: 1.2rem;
    height: 1.2rem;
    margin: 0;
    accent-color: var(--accent);
    cursor: pointer;
  }
</style>
