<script lang="ts">
  import { gamePhase, rollDice, buyProperty, buildHouse, nextTurn, currentPlayerIndex, players, dice, board } from '../store/gameStore';
  
  $: currentPlayer = $players[$currentPlayerIndex];
  $: canRoll = $gamePhase === 'ROLL_DICE';
  $: isActionPhase = $gamePhase === 'ACTION';
  
  // Check if current tile is own property
  $: currentTile = $board[currentPlayer?.position];
  $: isOwnProperty = currentTile?.type === 'PROPERTY' && 
                     currentTile?.property?.ownerId === currentPlayer?.id;
  $: canBuyProperty = isActionPhase && !isOwnProperty;
  $: canBuildHouse = isActionPhase && isOwnProperty;
</script>

<div class="flex flex-col items-center gap-4 p-6 bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700 w-full">
  <div class="text-2xl font-bold mb-2 flex items-center gap-3">
    <div class={`w-6 h-6 rounded-full ${currentPlayer.color} border-2 border-white`}></div>
    {currentPlayer.name}
  </div>
  
  <!-- Dice Display -->
  <div class="flex gap-4 items-center mb-4">
    <div class="w-16 h-16 flex items-center justify-center bg-white text-black text-4xl font-bold rounded-lg shadow-inner border-4 border-gray-300">
      {$dice[0]}
    </div>
    <div class="w-16 h-16 flex items-center justify-center bg-white text-black text-4xl font-bold rounded-lg shadow-inner border-4 border-gray-300">
      {$dice[1]}
    </div>
  </div>

  <div class="flex flex-col w-full gap-3">
    {#if canRoll}
      <button 
        class="w-full py-3 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-500 transition-all shadow-lg animate-pulse"
        on:click={rollDice}
      >
        🎲 擲骰子 (Roll)
      </button>
    {:else if $gamePhase === 'MOVING'}
      <div class="text-center text-gray-400 font-bold py-2">
        移動中...
      </div>
    {:else if $gamePhase === 'DRAW_CARD'}
      <div class="text-center text-yellow-400 font-bold py-2">
        抽卡中...
      </div>
    {:else if canBuyProperty}
      <button 
        class="w-full py-3 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-500 transition-all shadow-lg"
        on:click={buyProperty}
      >
        💰 購買此地產
      </button>
      <button 
        class="w-full py-3 bg-gray-600 text-white text-lg font-bold rounded-lg hover:bg-gray-500 transition-all shadow-lg"
        on:click={nextTurn}
      >
        ❌ 不購買 (結束回合)
      </button>
    {:else if canBuildHouse}
      <button 
        class="w-full py-3 bg-yellow-600 text-white text-lg font-bold rounded-lg hover:bg-yellow-500 transition-all shadow-lg"
        on:click={() => buildHouse(currentPlayer.position)}
      >
        🏗️ 增建房屋
      </button>
      <button 
        class="w-full py-3 bg-gray-600 text-white text-lg font-bold rounded-lg hover:bg-gray-500 transition-all shadow-lg"
        on:click={nextTurn}
      >
        ❌ 不增建 (結束回合)
      </button>
    {:else}
      <div class="text-center text-gray-500 py-2">
        等待中...
      </div>
    {/if}
  </div>
  
  <div class="mt-4 text-xs text-gray-500 uppercase tracking-wider">
    Phase: {$gamePhase}
  </div>
</div>
