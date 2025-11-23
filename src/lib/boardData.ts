import type { Tile } from '../types';

export const createInitialBoard = (): Tile[] => {
    const tiles: Tile[] = [];

    // Helper to create property with rent progression
    const prop = (name: string, price: number, color: string, baseRent: number) => ({
        type: 'PROPERTY' as const,
        name,
        property: {
            price,
            rent: baseRent,
            rentWithHouses: [
                baseRent * 5,    // 1 house
                baseRent * 15,   // 2 houses
                baseRent * 45,   // 3 houses
                baseRent * 80,   // 4 houses
                baseRent * 120   // Hotel
            ],
            color,
            ownerId: null,
            houses: 0
        }
    });

    // Helper for railroads - special properties with multiplier rent
    const railroad = (name: string) => ({
        type: 'RAILROAD' as const,
        name,
        property: {
            price: 200,
            rent: 25, // Base rent for 1 station
            rentWithHouses: [50, 100, 200, 200, 200], // 2, 3, 4 stations (houses field used as count)
            color: 'bg-gray-800 text-white',
            ownerId: null,
            houses: 0 // Not used for stations but needed for type
        }
    });

    const other = (type: any, name: string) => ({ type, name });

    // Classic Monopoly Layout (Simplified Names for TW/HK context)
    // Bottom Row (Right to Left) -> index 0 to 10? 
    // Actually standard is usually:
    // 0: GO (Bottom Right)
    // 1-9: Bottom properties
    // 10: Jail (Bottom Left)
    // 11-19: Left properties
    // 20: Free Parking (Top Left)
    // 21-29: Top properties
    // 30: Go To Jail (Top Right)
    // 31-39: Right properties

    // Colors
    const BROWN = 'bg-[#8B4513] text-white';
    const LIGHT_BLUE = 'bg-[#87CEEB]';
    const PINK = 'bg-[#FF69B4]';
    const ORANGE = 'bg-[#FFA500]';
    const RED = 'bg-[#FF0000] text-white';
    const YELLOW = 'bg-[#FFD700]';
    const GREEN = 'bg-[#008000] text-white';
    const BLUE = 'bg-[#0000FF] text-white';

    // 0: GO
    tiles.push(other('GO', '起點'));
    // 1-9: Bottom
    tiles.push(prop('建國路', 60, BROWN, 2));
    tiles.push(other('COMMUNITY_CHEST', '命運'));
    tiles.push(prop('和平路', 60, BROWN, 4));
    tiles.push(other('TAX', '所得稅'));
    tiles.push(railroad('台北車站'));
    tiles.push(prop('新生南路', 100, LIGHT_BLUE, 6));
    tiles.push(other('CHANCE', '機會'));
    tiles.push(prop('新生北路', 100, LIGHT_BLUE, 6));
    tiles.push(prop('建國北路', 120, LIGHT_BLUE, 8));

    // 10: Jail
    tiles.push(other('JAIL', '監獄'));
    // 11-19: Left
    tiles.push(prop('信義路', 140, PINK, 10));
    tiles.push(other('UTILITY', '電力公司'));
    tiles.push(prop('仁愛路', 140, PINK, 10));
    tiles.push(prop('忠孝東路', 160, PINK, 12));
    tiles.push(railroad('台中車站'));
    tiles.push(prop('復興南路', 180, ORANGE, 14));
    tiles.push(other('COMMUNITY_CHEST', '命運'));
    tiles.push(prop('復興北路', 180, ORANGE, 14));
    tiles.push(prop('敦化南路', 200, ORANGE, 16));

    // 20: Free Parking
    tiles.push(other('FREE_PARKING', '免費停車'));
    // 21-29: Top
    tiles.push(prop('民權東路', 220, RED, 18));
    tiles.push(other('CHANCE', '機會'));
    tiles.push(prop('民權西路', 220, RED, 18));
    tiles.push(prop('民族東路', 240, RED, 20));
    tiles.push(railroad('台南車站'));
    tiles.push(prop('羅斯福路', 260, YELLOW, 22));
    tiles.push(prop('辛亥路', 260, YELLOW, 22));
    tiles.push(other('UTILITY', '自來水廠'));
    tiles.push(prop('光復南路', 280, YELLOW, 24));

    // 30: Go To Jail
    tiles.push(other('GO_TO_JAIL', '入獄'));
    // 31-39: Right
    tiles.push(prop('南京東路', 300, GREEN, 26));
    tiles.push(prop('南京西路', 300, GREEN, 26));
    tiles.push(other('COMMUNITY_CHEST', '命運'));
    tiles.push(prop('松山路', 320, GREEN, 28));
    tiles.push(railroad('高雄車站'));
    tiles.push(other('CHANCE', '機會'));
    tiles.push(prop('信義計畫區', 350, BLUE, 35));
    tiles.push(other('TAX', '奢侈稅'));
    tiles.push(prop('帝寶', 400, BLUE, 50));

    // Fix indices
    return tiles.map((t, i) => ({ ...t, index: i }));
};
