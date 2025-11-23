import { writable, get } from 'svelte/store';
import type { Player, Tile, GamePhase, MoneyAnimation, Card, PlayerToken } from '../types';
import { createInitialBoard } from '../lib/boardData';
import { createChanceCards, createCommunityChestCards, shuffleCards } from '../lib/cards';

// Initial State
export const players = writable<Player[]>([]);
export const board = writable<Tile[]>(createInitialBoard());
export const currentPlayerIndex = writable<number>(0);
export const dice = writable<[number, number]>([1, 1]);
export const gamePhase = writable<GamePhase>('SETUP');
export const gameLog = writable<string[]>(['請選擇玩家人數開始遊戲']);
export const moneyAnimations = writable<MoneyAnimation[]>([]);
export const chanceCards = writable<Card[]>([]);
export const communityChestCards = writable<Card[]>([]);
export const currentCard = writable<Card | null>(null);

// Actions
export const startGame = (playerCount: number) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    const tokens: PlayerToken[] = ['CAR', 'DOG', 'HAT', 'SHOE', 'SHIP'];
    const newPlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
        newPlayers.push({
            id: i,
            name: `玩家 ${i + 1}`,
            color: colors[i],
            token: tokens[i],
            money: 1500,
            position: 0,
            properties: [],
            isJailed: false
        });
    }
    players.set(newPlayers);
    // Shuffle card decks
    chanceCards.set(shuffleCards(createChanceCards()));
    communityChestCards.set(shuffleCards(createCommunityChestCards()));
    gamePhase.set('ROLL_DICE');
    addLog(`遊戲開始！共 ${playerCount} 位玩家`);
    addLog(`輪到 ${newPlayers[0].name}`);
};

export const addLog = (message: string) => {
    gameLog.update(logs => [message, ...logs].slice(0, 50));
};

export const rollDice = async () => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    dice.set([d1, d2]);
    addLog(`玩家 ${get(players)[get(currentPlayerIndex)].name} 擲出了 ${d1} 和 ${d2}`);

    // Move player with animation
    await movePlayerSteps(d1 + d2);
};

const movePlayerSteps = async (totalSteps: number) => {
    gamePhase.set('MOVING');
    const pIndex = get(currentPlayerIndex);

    // Clear jail status when player starts moving
    players.update(allPlayers => {
        if (allPlayers[pIndex].isJailed) {
            allPlayers[pIndex].isJailed = false;
            addLog(`玩家 ${allPlayers[pIndex].name} 離開監獄`);
        }
        return allPlayers;
    });

    for (let i = 0; i < totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, 200)); // 0.2s per step

        players.update(allPlayers => {
            const player = { ...allPlayers[pIndex] };
            let newPos = player.position + 1;

            if (newPos >= 40) {
                newPos = 0;
                player.money += 200;
                addLog(`玩家 ${player.name} 經過起點，獲得 $200`);
                triggerMoneyAnimation(200, 'BANK', player.id);
            }

            player.position = newPos;
            allPlayers[pIndex] = player;
            return allPlayers;
        });
    }

    // Finished moving
    const player = get(players)[pIndex];
    handleTileLanding(player, player.position);
};

const triggerMoneyAnimation = (amount: number, fromId: number | 'BANK', toId: number | 'BANK') => {
    const id = Math.random().toString(36).substr(2, 9);
    moneyAnimations.update(anims => [...anims, { id, amount, fromId, toId }]);
    setTimeout(() => {
        moneyAnimations.update(anims => anims.filter(a => a.id !== id));
    }, 1500); // Animation duration
};

const handleTileLanding = (player: Player, pos: number) => {
    const currentBoard = get(board);
    const tile = currentBoard[pos];

    addLog(`玩家 ${player.name} 到達了 ${tile.name}`);

    if (tile.type === 'GO_TO_JAIL') {
        addLog(`玩家 ${player.name} 入獄！`);
        players.update(ps => {
            ps[player.id].position = 10; // Jail position
            ps[player.id].isJailed = true;
            return ps;
        });
        autoEndTurn();
        return;
    }

    // Draw card from deck
    if (tile.type === 'CHANCE' || tile.type === 'COMMUNITY_CHEST') {
        drawCard(tile.type);
        return; // Card handling will advance turn
    }

    if (tile.type === 'PROPERTY' && tile.property) {
        if (tile.property.ownerId === null) {
            // Can buy
            if (player.money >= tile.property.price) {
                gamePhase.set('ACTION'); // Wait for user decision
            } else {
                addLog(`玩家 ${player.name} 錢不夠買這塊地`);
                autoEndTurn();
            }
        } else if (tile.property.ownerId !== player.id) {
            // Pay rent (with houses)
            const ownerId = tile.property.ownerId!;
            const houses = tile.property.houses;
            let rent = tile.property.rent;

            if (houses > 0) {
                // Calculate rent based on houses (0-4) or hotel (5)
                rent = houses === 5
                    ? tile.property.rentWithHouses[4]
                    : tile.property.rentWithHouses[houses - 1];
            }

            const owner = get(players)[ownerId];
            addLog(`玩家 ${player.name} 支付租金 $${Math.round(rent)} 給 ${owner.name}`);
            triggerMoneyAnimation(Math.round(rent), player.id, ownerId);

            players.update(ps => {
                ps[player.id].money -= Math.round(rent);
                ps[ownerId].money += Math.round(rent);
                return ps;
            });
            autoEndTurn();
        } else {
            // Own property - offer to build
            addLog(`這是玩家 ${player.name} 自己的地`);

            // Check if can build (not hotel yet and has money)
            const houseCost = Math.round(tile.property.price * 0.5);
            if (tile.property.houses < 5 && player.money >= houseCost) {
                gamePhase.set('ACTION'); // Allow build decision
            } else {
                if (tile.property.houses >= 5) {
                    addLog('已經蓋了旅館');
                } else {
                    addLog(`蓋房需要 $${houseCost}，錢不夠`);
                }
                autoEndTurn();
            }
        }
    } else if (tile.type === 'RAILROAD' && tile.property) {
        if (tile.property.ownerId === null) {
            // Can buy station
            if (player.money >= tile.property.price) {
                gamePhase.set('ACTION');
            } else {
                addLog(`玩家 ${player.name} 錢不夠買車站`);
                autoEndTurn();
            }
        } else if (tile.property.ownerId !== player.id) {
            // Pay railroad rent based on number owned
            const ownerId = tile.property.ownerId!;
            const owner = get(players)[ownerId];

            // Count how many railroads this owner has
            const currentBoard = get(board);
            const railroadCount = currentBoard.filter(t =>
                t.type === 'RAILROAD' && t.property?.ownerId === ownerId
            ).length;

            // Rent: 1 station = $25, 2 = $50, 3 = $100, 4 = $200
            const rent = railroadCount === 1 ? 25 :
                railroadCount === 2 ? 50 :
                    railroadCount === 3 ? 100 : 200;

            addLog(`玩家 ${player.name} 支付車站租金 $${rent} 給 ${owner.name} (擁有${railroadCount}個車站)`);
            triggerMoneyAnimation(rent, player.id, ownerId);

            players.update(ps => {
                ps[player.id].money -= rent;
                ps[ownerId].money += rent;
                return ps;
            });
            autoEndTurn();
        } else {
            addLog(`這是玩家 ${player.name} 自己的車站`);
            autoEndTurn();
        }
    } else if (tile.type === 'TAX') {
        const tax = 200;
        addLog(`玩家 ${player.name} 支付稅金 $${tax}`);
        triggerMoneyAnimation(tax, player.id, 'BANK');
        players.update(ps => {
            ps[player.id].money -= tax;
            return ps;
        });
        autoEndTurn();
    } else {
        // Nothing happens (Parking etc)
        autoEndTurn();
    }
};

const drawCard = (cardType: 'CHANCE' | 'COMMUNITY_CHEST') => {
    gamePhase.set('DRAW_CARD');
    const deck = cardType === 'CHANCE' ? get(chanceCards) : get(communityChestCards);

    if (deck.length === 0) {
        // Reshuffle if empty
        const newDeck = shuffleCards(
            cardType === 'CHANCE' ? createChanceCards() : createCommunityChestCards()
        );
        if (cardType === 'CHANCE') {
            chanceCards.set(newDeck);
        } else {
            communityChestCards.set(newDeck);
        }
        drawCard(cardType); // Try again
        return;
    }

    // Draw top card
    const card = deck[0];
    currentCard.set(card);
    addLog(`抽到卡片: ${card.title}`);

    // Remove card from deck
    if (cardType === 'CHANCE') {
        chanceCards.update(cards => cards.slice(1));
    } else {
        communityChestCards.update(cards => cards.slice(1));
    }

    // Execute card action after a delay (let user read it)
    setTimeout(() => {
        executeCardAction(card);
    }, 2500);
};

const executeCardAction = (card: Card) => {
    const pIndex = get(currentPlayerIndex);

    if (card.action === 'MONEY') {
        const amount = card.amount || 0;
        players.update(ps => {
            ps[pIndex].money += amount;
            return ps;
        });
        if (amount > 0) {
            triggerMoneyAnimation(amount, 'BANK', pIndex);
        } else {
            triggerMoneyAnimation(-amount, pIndex, 'BANK');
        }
    } else if (card.action === 'MOVE' && card.position !== undefined) {
        players.update(ps => {
            ps[pIndex].position = card.position!;
            return ps;
        });
    } else if (card.action === 'GO_TO_JAIL') {
        players.update(ps => {
            ps[pIndex].position = 10;
            ps[pIndex].isJailed = true;
            return ps;
        });
    }

    // Close card and end turn
    setTimeout(() => {
        currentCard.set(null);
        autoEndTurn();
    }, 1500);
};

const autoEndTurn = () => {
    gamePhase.set('END_TURN');
    setTimeout(() => {
        nextTurn();
    }, 1500); // Wait for animations/reading
};

export const buyProperty = () => {
    const pIndex = get(currentPlayerIndex);
    const allPlayers = get(players);
    const player = allPlayers[pIndex];
    const currentBoard = get(board);
    const tile = currentBoard[player.position];

    if (tile.type === 'PROPERTY' && tile.property && tile.property.ownerId === null) {
        if (player.money >= tile.property.price) {
            const price = tile.property.price;
            // Deduct money
            players.update(ps => {
                ps[pIndex].money -= price;
                ps[pIndex].properties.push(tile.index);
                return ps;
            });
            triggerMoneyAnimation(price, player.id, 'BANK');

            // Set owner
            board.update(bs => {
                if (bs[tile.index].property) {
                    bs[tile.index].property!.ownerId = player.id;
                }
                return bs;
            });

            addLog(`玩家 ${player.name} 購買了 ${tile.name}`);
            nextTurn(); // End turn immediately after buying
        }
    }
};

export const nextTurn = () => {
    currentPlayerIndex.update(n => (n + 1) % get(players).length);
    gamePhase.set('ROLL_DICE');
    const nextPlayerIndex = get(currentPlayerIndex);
    addLog(`輪到 ${get(players)[nextPlayerIndex].name}`);
};

export const buildHouse = (tileIndex: number) => {
    const pIndex = get(currentPlayerIndex);
    const player = get(players)[pIndex];
    const currentBoard = get(board);
    const tile = currentBoard[tileIndex];

    if (tile.type !== 'PROPERTY' || !tile.property) return;
    if (tile.property.ownerId !== player.id) return;
    if (tile.property.houses >= 5) {
        addLog('已經蓋了旅館，無法再蓋');
        return;
    }

    // House cost is usually half the property price
    const houseCost = Math.round(tile.property.price * 0.5);

    if (player.money < houseCost) {
        addLog(`沒有足夠的錢蓋房子 (需要 $${houseCost})`);
        return;
    }

    // Build house
    players.update(ps => {
        ps[pIndex].money -= houseCost;
        return ps;
    });

    board.update(bs => {
        if (bs[tileIndex].property) {
            bs[tileIndex].property!.houses++;
        }
        return bs;
    });

    const houseType = tile.property.houses === 4 ? '旅館' : '房屋';
    addLog(`玩家 ${player.name} 在 ${tile.name} 蓋了${houseType}`);
    triggerMoneyAnimation(houseCost, player.id, 'BANK');
};
