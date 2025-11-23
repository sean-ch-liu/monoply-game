<script lang="ts">
  import { startGame } from '../store/gameStore';
  
  let playerCount = 2;
</script>

<div class="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex items-center justify-center">
  <div class="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
    <h1 class="text-4xl font-bold mb-8 text-blue-600">大富窩 Monopoly</h1>
    
    <div class="mb-8">
      <label class="block text-gray-700 text-lg font-bold mb-4">
        選擇玩家人數
      </label>
      <div class="flex justify-center gap-4">
        {#each [2, 3, 4, 5] as count}
          <button 
            class={`w-12 h-12 rounded-full text-xl font-bold transition-all
              ${playerCount === count 
                ? 'bg-blue-600 text-white scale-110 shadow-lg' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            on:click={() => playerCount = count}
          >
            {count}
          </button>
        {/each}
      </div>
    </div>

    <button 
      class="w-full py-4 bg-green-600 text-white text-xl font-bold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
      on:click={() => startGame(playerCount)}
    >
      開始遊戲
    </button>
  </div>
</div>
