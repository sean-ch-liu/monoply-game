<script lang="ts">
  import { board, players } from '../store/gameStore';
  import TileComponent from './Tile.svelte';
  
  // 40 Tiles Layout (11x11 Grid)
  // Grid size: 11x11
  // Indices:
  // 0: (11, 11) [Bottom Right]
  // 1-9: (11, 10) to (11, 2) [Bottom]
  // 10: (11, 1) [Bottom Left]
  // 11-19: (10, 1) to (2, 1) [Left]
  // 20: (1, 1) [Top Left]
  // 21-29: (1, 2) to (1, 10) [Top]
  // 30: (1, 11) [Top Right]
  // 31-39: (2, 11) to (10, 11) [Right]

  const getGridStyle = (index: number) => {
    let col = 1;
    let row = 1;

    if (index === 0) { // GO
      row = 11; col = 11;
    } else if (index >= 1 && index <= 9) { // Bottom
      row = 11;
      col = 11 - index;
    } else if (index === 10) { // Jail
      row = 11; col = 1;
    } else if (index >= 11 && index <= 19) { // Left
      col = 1;
      row = 11 - (index - 10);
    } else if (index === 20) { // Free Parking
      row = 1; col = 1;
    } else if (index >= 21 && index <= 29) { // Top
      row = 1;
      col = 1 + (index - 20);
    } else if (index === 30) { // Go To Jail
      row = 1; col = 11;
    } else if (index >= 31 && index <= 39) { // Right
      col = 11;
      row = 1 + (index - 30);
    }

    return `grid-column: ${col}; grid-row: ${row};`;
  };
</script>

<div class="relative bg-[#CDE6D0] p-2 rounded-xl shadow-2xl w-fit mx-auto border-8 border-red-700">
  <div class="grid grid-cols-11 grid-rows-11 gap-0.5 w-[800px] h-[800px]">
    <!-- Center Area -->
    <div class="col-start-2 col-end-11 row-start-2 row-end-11 flex items-center justify-center bg-[#CDE6D0]">
      <div class="text-6xl font-bold text-red-700 opacity-20 rotate-[-45deg] tracking-widest">
        MONOPOLY
      </div>
    </div>

    {#each $board as tile (tile.index)}
      <div style={getGridStyle(tile.index)} class="relative border border-black bg-[#CDE6D0]">
        <TileComponent 
          {tile} 
          playersOnTile={$players.filter(p => p.position === tile.index)} 
        />
      </div>
    {/each}
  </div>
</div>
