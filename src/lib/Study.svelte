<script lang="ts">
  import type { Card, Deck } from './decks'

  let { deck, onexit }: { deck: Deck; onexit: () => void } = $props()

  // svelte-ignore state_referenced_locally
  let cards = $state<Card[]>([...deck.cards])
  let index = $state(0)
  let flipped = $state(false)
  let showDetails = $state(false)

  let card = $derived(cards[index])

  function flip() {
    flipped = !flipped
    showDetails = false
  }

  function go(delta: number) {
    const next = index + delta
    if (next < 0 || next >= cards.length) return
    index = next
    flipped = false
    showDetails = false
  }

  function shuffle() {
    const copy = [...cards]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    cards = copy
    index = 0
    flipped = false
    showDetails = false
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      flip()
    } else if (e.key === 'i' && flipped && card?.details) {
      showDetails = !showDetails
    } else if (e.key === 'ArrowRight') go(1)
    else if (e.key === 'ArrowLeft') go(-1)
    else if (e.key === 'Escape') onexit()
  }
</script>

<svelte:window {onkeydown} />

<div class="study">
  <header>
    <button class="link" onclick={onexit}>← Decks</button>
    <h2>{deck.name}</h2>
    <button class="link" onclick={shuffle}>Shuffle</button>
  </header>

  {#if card}
    <!-- Keyboard flipping is handled by the window keydown listener. -->
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="card" class:flipped onclick={flip}>
      <div class="inner">
        <div class="face front" aria-hidden={flipped}>
          {#if card.source}<span class="source">{card.source}</span>{/if}
          <p class="text">{card.front}</p>
        </div>
        <div class="face back" class:expanded={showDetails} aria-hidden={!flipped}>
          {#if card.source}<span class="source">{card.source}</span>{/if}
          <p class="text">{card.back}</p>
          {#if card.details}
            <button
              class="more"
              tabindex={flipped ? 0 : -1}
              aria-expanded={showDetails}
              onclick={(e) => {
                e.stopPropagation()
                showDetails = !showDetails
              }}
            >
              {showDetails ? 'Less info' : 'More info'}
            </button>
            {#if showDetails}
              <p class="details">{card.details}</p>
            {/if}
          {/if}
        </div>
      </div>
    </div>

    <nav>
      <button onclick={() => go(-1)} disabled={index === 0}>Previous</button>
      <span>{index + 1} / {cards.length}</span>
      <button onclick={() => go(1)} disabled={index === cards.length - 1}>Next</button>
    </nav>
    <p class="hint">
      Click or press Space to flip · I for more info · ← → to navigate · Esc to exit
    </p>
  {:else}
    <p>This deck has no cards.</p>
  {/if}
</div>

<style>
  .study {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h2 {
    margin: 0;
  }

  .link {
    background: none;
    border: none;
    color: var(--accent);
    padding: 0.25rem 0;
  }

  .card {
    width: min(100%, 36rem);
    aspect-ratio: 3 / 2;
    perspective: 1200px;
    cursor: pointer;
  }

  .inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.45s ease;
    transform-style: preserve-3d;
  }

  .flipped .inner {
    transform: rotateY(180deg);
  }

  .face {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    overflow-y: auto;
    backface-visibility: hidden;
    box-shadow: 0 4px 20px rgb(0 0 0 / 0.12);
  }

  .source {
    position: absolute;
    top: 0.8rem;
    left: 1.25rem;
    font-size: 0.8rem;
    opacity: 0.6;
  }

  .text {
    margin: 0;
    font-size: 1.75rem;
    line-height: 1.3;
    white-space: pre-wrap;
  }

  .front {
    background: var(--surface);
  }

  .back {
    background: var(--accent);
    color: white;
    transform: rotateY(180deg);
  }

  .back.expanded {
    justify-content: flex-start;
  }

  .back.expanded .text {
    font-size: 1.35rem;
  }

  .more {
    flex-shrink: 0;
    background: rgb(255 255 255 / 0.15);
    border-color: rgb(255 255 255 / 0.4);
    color: white;
    font-size: 0.9rem;
    padding: 0.3rem 0.9rem;
  }

  .more:hover {
    background: rgb(255 255 255 / 0.25);
  }

  .details {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
    text-align: left;
    white-space: pre-wrap;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  nav span {
    min-width: 4rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .hint {
    margin: 0;
    font-size: 0.85rem;
    opacity: 0.6;
  }
</style>
