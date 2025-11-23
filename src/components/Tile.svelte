<script lang="ts">
  import type { Tile, Player } from '../types';
  import PlayerToken from './PlayerToken.svelte';
  import { players } from '../store/gameStore';

  export let tile: Tile;
  export let playersOnTile: Player[] = [];
  
  // Get owner info if owned
  $: owner = tile.property?.ownerId !== null && tile.property?.ownerId !== undefined
    ? $players[tile.property.ownerId]
    : null;
  
  // Determine if it's a corner for styling
  $: isCorner = ['GO', 'JAIL', 'FREE_PARKING', 'GO_TO_JAIL'].includes(tile.type);
  
  // Houses display
  $: houses = tile.property?.houses || 0;
</script>

<div class="w-full h-full flex flex-col relative text-[9px] leading-tight text-center overflow-hidden bg-white">
  
  <!-- Property Color Bar (Only for properties) -->
  {#if tile.type === 'PROPERTY' && tile.property}
    {#if tile.index >= 11 && tile.index <= 19} 
       <!-- Left Side: Color on Right -->
       <div class={`absolute right-0 top-0 bottom-0 w-[22%] ${tile.property.color} border-l-2 border-black`}></div>
       <div class="flex flex-col justify-between items-center pr-[23%] h-full p-1">
          <div class="font-bold leading-tight mt-1">{tile.name}</div>
          <div class="text-[8px] font-semibold">${tile.property.price}</div>
          
          <!-- Houses display -->
          {#if houses > 0}
            <div class="flex gap-px mt-1">
              {#if houses === 5}
                <div class="w-3 h-3 bg-red-600 border border-black text-[6px] flex items-center justify-center font-bold text-white">H</div>
              {:else}
                {#each Array(houses) as _, i}
                  <div class="w-1.5 h-1.5 bg-green-600 border border-black"></div>
                {/each}
              {/if}
            </div>
          {/if}
          
          <!-- Owner indicator -->
          {#if owner}
            <div class={`w-2 h-2 rounded-full ${owner.color} border border-white mt-auto`}></div>
          {/if}
       </div>
    {:else if tile.index >= 31 && tile.index <= 39}
       <!-- Right Side: Color on Left -->
       <div class={`absolute left-0 top-0 bottom-0 w-[22%] ${tile.property.color} border-r-2 border-black`}></div>
       <div class="flex flex-col justify-between items-center pl-[23%] h-full p-1">
          <div class="font-bold leading-tight mt-1">{tile.name}</div>
          <div class="text-[8px] font-semibold">${tile.property.price}</div>
          
          <!-- Houses display -->
          {#if houses > 0}
            <div class="flex gap-px mt-1">
              {#if houses === 5}
                <div class="w-3 h-3 bg-red-600 border border-black text-[6px] flex items-center justify-center font-bold text-white">H</div>
              {:else}
                {#each Array(houses) as _, i}
                  <div class="w-1.5 h-1.5 bg-green-600 border border-black"></div>
                {/each}
              {/if}
            </div>
          {/if}
          
          <!-- Owner indicator -->
          {#if owner}
            <div class={`w-2 h-2 rounded-full ${owner.color} border border-white mt-auto`}></div>
          {/if}
       </div>
    {:else if tile.index >= 21 && tile.index <= 29}
       <!-- Top Side: Color on Bottom -->
       <div class="flex-1 flex flex-col justify-between items-center pb-[18%] w-full p-1">
          <div class="font-bold leading-tight mt-1">{tile.name}</div>
          <div class="text-[8px] font-semibold">${tile.property.price}</div>
          
          <!-- Houses display -->
          {#if houses > 0}
            <div class="flex gap-px">
              {#if houses === 5}
                <div class="w-3 h-3 bg-red-600 border border-black text-[6px] flex items-center justify-center font-bold text-white">H</div>
              {:else}
                {#each Array(houses) as _, i}
                  <div class="w-1.5 h-1.5 bg-green-600 border border-black"></div>
                {/each}
              {/if}
            </div>
          {/if}
          
          <!-- Owner indicator -->
          {#if owner}
            <div class={`w-2 h-2 rounded-full ${owner.color} border border-white`}></div>
          {/if}
       </div>
       <div class={`w-full h-[18%] ${tile.property.color} border-t-2 border-black`}></div>
    {:else}
       <!-- Bottom Side (Default): Color on Top -->
       <div class={`w-full h-[18%] ${tile.property.color} border-b-2 border-black`}></div>
       <div class="flex-1 flex flex-col justify-between items-center pt-[2%] w-full p-1">
          <div class="font-bold leading-tight mt-1">{tile.name}</div>
          <div class="text-[8px] font-semibold">${tile.property.price}</div>
          
          <!-- Houses display -->
          {#if houses > 0}
            <div class="flex gap-px">
              {#if houses === 5}
                <div class="w-3 h-3 bg-red-600 border border-black text-[6px] flex items-center justify-center font-bold text-white">H</div>
              {:else}
                {#each Array(houses) as _, i}
                  <div class="w-1.5 h-1.5 bg-green-600 border border-black"></div>
                {/each}
              {/if}
            </div>
          {/if}
          
          <!-- Owner indicator -->
          {#if owner}
            <div class={`w-2 h-2 rounded-full ${owner.color} border border-white mb-1`}></div>
          {/if}
       </div>
    {/if}

  {:else}
    <!-- Non-Property Tiles -->
    <div class="flex-1 flex flex-col items-center justify-center p-1 font-bold text-[10px]">
      {#if tile.type === 'CHANCE'}
        <div class="text-xl">🎲</div>
        <div class="mt-1">機會</div>
      {:else if tile.type === 'COMMUNITY_CHEST'}
        <div class="text-xl">🏛️</div>
        <div class="mt-1">命運</div>
      {:else if tile.type === 'GO'}
        <div class="text-2xl">→</div>
        <div class="mt-1 font-extrabold">起點</div>
        <div class="text-[7px]">領$200</div>
      {:else if tile.type === 'JAIL'}
        <div class="text-xl">🔒</div>
        <div class="mt-1">監獄</div>
      {:else if tile.type === 'FREE_PARKING'}
        <div class="text-xl">🅿️</div>
        <div class="mt-1">免費<br/>停車</div>
      {:else if tile.type === 'GO_TO_JAIL'}
        <div class="text-xl">👮</div>
        <div class="mt-1">入獄</div>
      {:else if tile.type === 'TAX'}
        <div class="text-xl">💰</div>
        <div class="mt-1">{tile.name}</div>
      {:else}
        <div class="whitespace-pre-line">{tile.name}</div>
      {/if}
    </div>
  {/if}

  <!-- Players -->
  <div class="absolute inset-0 flex items-end justify-center flex-wrap content-end gap-0.5 p-0.5 pointer-events-none z-20 pb-1">
    {#each playersOnTile as player}
      <PlayerToken {player} />
    {/each}
  </div>
</div>
