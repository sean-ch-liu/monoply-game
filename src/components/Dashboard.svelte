<script lang="ts">
  import { players, gameLog, currentPlayerIndex, board } from '../store/gameStore';
</script>

<div class="flex flex-col gap-4 h-full">
  <!-- Players Info -->
  <div class="bg-white p-4 rounded-lg shadow-md">
    <h2 class="text-lg font-bold mb-2">玩家資訊</h2>
    <div class="space-y-2">
      {#each $players as player, i}
        <div class={`p-2 rounded border ${i === $currentPlayerIndex ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class={`w-3 h-3 rounded-full ${player.color}`}></div>
              <span class="font-medium">{player.name}</span>
            </div>
            <span class="font-bold text-green-600">${player.money}</span>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            地產: {player.properties.length} 筆
            {#if player.isJailed}
              <span class="text-red-500 ml-2">(坐牢中)</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Game Log -->
  <div class="bg-white p-4 rounded-lg shadow-md flex-1 overflow-hidden flex flex-col">
    <h2 class="text-lg font-bold mb-2">遊戲紀錄</h2>
    <div class="overflow-y-auto flex-1 text-sm space-y-1 pr-2">
      {#each $gameLog as log}
        <div class="border-b border-gray-100 pb-1 last:border-0">{log}</div>
      {/each}
    </div>
  </div>
</div>
