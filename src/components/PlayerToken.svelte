<script lang="ts">
  import type { Player } from '../types';
  export let player: Player;
  
  // Map tokens to their visual representations (using emojis for now)
  const tokenIcons: Record<string, string> = {
    'CAR': '🚗',
    'DOG': '🐕',
    'HAT': '🎩',
    'SHOE': '👞',
    'SHIP': '⛵'
  };
</script>

<div 
  class={`w-5 h-5 rounded-full flex items-center justify-center text-xs border-2 border-white shadow-lg ${player.color}`}
  title={player.name}
>
  <span class="transform scale-75">{tokenIcons[player.token]}</span>
</div>
