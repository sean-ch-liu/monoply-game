<script lang="ts">
  import Board from './components/Board.svelte';
  import Controls from './components/Controls.svelte';
  import Dashboard from './components/Dashboard.svelte';
  import SetupScreen from './components/SetupScreen.svelte';
  import MoneyAnimation from './components/MoneyAnimation.svelte';
  import CardDisplay from './components/CardDisplay.svelte';
  import { gamePhase } from './store/gameStore';
</script>

<main class="min-h-screen bg-gray-800 p-4 font-sans text-gray-900 overflow-hidden relative">
  
  {#if $gamePhase === 'SETUP'}
    <SetupScreen />
  {:else}
    <div class="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-[auto_400px] gap-8 h-screen py-4">
      
      <!-- Left Column: Game Board -->
      <div class="flex items-center justify-center overflow-auto">
        <div class="scale-[0.85] origin-center">
          <Board />
        </div>
      </div>

      <!-- Right Column: Controls & Info -->
      <div class="flex flex-col gap-4 h-full max-h-[90vh]">
        <Controls />
        <Dashboard />
      </div>

    </div>
    
    <MoneyAnimation />
    <CardDisplay />
  {/if}

</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #1f2937;
  }
</style>
