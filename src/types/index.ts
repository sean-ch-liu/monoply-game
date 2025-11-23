export type PlayerToken = 'CAR' | 'DOG' | 'HAT' | 'SHOE' | 'SHIP';

export type Player = {
    id: number;
    name: string;
    color: string;
    token: PlayerToken;
    money: number;
    position: number;
    properties: number[];
    isJailed: boolean;
};

export type Property = {
    price: number;
    rent: number;
    rentWithHouses: number[]; // Rent with 1, 2, 3, 4 houses, hotel
    color: string;
    ownerId: number | null;
    houses: number; // 0-4 houses, 5 = hotel
};

export type TileType = 'PROPERTY' | 'GO' | 'JAIL' | 'FREE_PARKING' | 'GO_TO_JAIL' | 'CHANCE' | 'COMMUNITY_CHEST' | 'TAX' | 'UTILITY' | 'RAILROAD';

export type Tile = {
    index: number;
    type: TileType;
    name: string;
    property?: Property;
};

export type GamePhase = 'SETUP' | 'ROLL_DICE' | 'MOVING' | 'ACTION' | 'END_TURN' | 'DRAW_CARD';

export type CardType = 'CHANCE' | 'COMMUNITY_CHEST';

export type Card = {
    type: CardType;
    title: string;
    description: string;
    action: 'MONEY' | 'MOVE' | 'GO_TO_JAIL' | 'GET_OUT_OF_JAIL';
    amount?: number; // For MONEY action
    position?: number; // For MOVE action
};

export type MoneyAnimation = {
    id: string;
    amount: number;
    fromId: number | 'BANK'; // Player ID or Bank
    toId: number | 'BANK';
};
