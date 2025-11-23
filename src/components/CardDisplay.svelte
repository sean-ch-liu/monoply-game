<script lang="ts">
  import { currentCard } from '../store/gameStore';
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  const closeCard = () => {
    currentCard.set(null);
  };
</script>

{#if $currentCard}
  <div 
    class="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-70"
    on:click={closeCard}
    transition:fade="{{ duration: 300 }}"
  >
    <div 
      class="relative w-80 h-96 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl shadow-2xl border-8 border-yellow-600 p-6 flex flex-col items-center justify-center"
      on:click|stopPropagation
      transition:scale="{{ duration: 500, easing: quintOut, start: 0.5 }}"
    >
      <!-- Card Type Header -->
      <div class={`absolute top-4 left-4 right-4 text-center py-2 rounded-lg font-bold text-white text-xl
        ${$currentCard.type === 'CHANCE' ? 'bg-orange-500' : 'bg-blue-500'}`}>
        {$currentCard.type === 'CHANCE' ? '🎲 機會' : '🎯 命運'}
      </div>

      <!-- Card Content -->
      <div class="mt-16 mb-8 text-center">
        <h3 class="text-2xl font-bold text-gray-800 mb-4">{$currentCard.title}</h3>
        <p class="text-lg text-gray-700">{$currentCard.description}</p>
      </div>

      <!-- Close Button -->
      <button 
        class="absolute bottom-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
        on:click={closeCard}
      >
        確定 (OK)
      </button>

      <!-- Decorative corners -->
      <div class="absolute top-3 left-3 w-6 h-6 border-t-4 border-l-4 border-yellow-700"></div>
      <div class="absolute top-3 right-3 w-6 h-6 border-t-4 border-r-4 border-yellow-700"></div>
      <div class="absolute bottom-3 left-3 w-6 h-6 border-b-4 border-l-4 border-yellow-700"></div>
      <div class="absolute bottom-3 right-3 w-6 h-6 border-b-4 border-r-4 border-yellow-700"></div>
    </div>
  </div>
{/if}
