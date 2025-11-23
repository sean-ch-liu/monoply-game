<script lang="ts">
  import { moneyAnimations, players } from '../store/gameStore';
  import { fly, fade } from 'svelte/transition';

  // Helper to get position (simplified for now, just center to corners/sides)
  // Ideally we'd use element.getBoundingClientRect() but that's complex in Svelte store
  // We'll just use fixed positions based on player ID for the dashboard area
  // or center of screen for Bank.
  
  // Let's assume:
  // Bank: Center screen (50%, 50%)
  // Players: We'll animate to a generic position or just float up
  
  // Better approach for "Flying to target":
  // Just show a big floating text in the center that moves slightly
</script>

<div class="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
  {#each $moneyAnimations as anim (anim.id)}
    <div 
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      in:fly="{{ y: 50, duration: 500 }}"
      out:fade="{{ duration: 500, delay: 1000 }}"
    >
      <div class="text-6xl animate-bounce">💸</div>
      <div class="text-4xl font-bold text-green-500 drop-shadow-md bg-white px-4 py-2 rounded-full border-4 border-green-500">
        ${anim.amount}
      </div>
      <div class="mt-2 text-xl font-bold text-white bg-black bg-opacity-50 px-3 py-1 rounded">
        {anim.fromId === 'BANK' ? '銀行' : `玩家 ${Number(anim.fromId) + 1}`} 
        ➔ 
        {anim.toId === 'BANK' ? '銀行' : `玩家 ${Number(anim.toId) + 1}`}
      </div>
    </div>
  {/each}
</div>
