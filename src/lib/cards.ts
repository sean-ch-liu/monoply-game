import type { Card } from '../types';

export const createChanceCards = (): Card[] => {
    return [
        { type: 'CHANCE', title: '前進', description: '前進至起點，領取$200', action: 'MOVE', position: 0 },
        { type: 'CHANCE', title: '銀行分紅', description: '銀行分紅，獲得$50', action: 'MONEY', amount: 50 },
        { type: 'CHANCE', title: '繳稅', description: '繳納所得稅$150', action: 'MONEY', amount: -150 },
        { type: 'CHANCE', title: '入獄', description: '直接入獄，不經過起點', action: 'GO_TO_JAIL' },
        { type: 'CHANCE', title: '出獄卡', description: '可用於出獄', action: 'GET_OUT_OF_JAIL' },
        { type: 'CHANCE', title: '紅利', description: '獲得紅利$100', action: 'MONEY', amount: 100 },
        { type: 'CHANCE', title: '罰款', description: '超速罰款$50', action: 'MONEY', amount: -50 },
        { type: 'CHANCE', title: '慈善捐款', description: '捐款$100', action: 'MONEY', amount: -100 },
    ];
};

export const createCommunityChestCards = (): Card[] => {
    return [
        { type: 'COMMUNITY_CHEST', title: '股票收益', description: '股票收益，獲得$100', action: 'MONEY', amount: 100 },
        { type: 'COMMUNITY_CHEST', title: '醫療費', description: '支付醫療費$50', action: 'MONEY', amount: -50 },
        { type: 'COMMUNITY_CHEST', title: '保險到期', description: '保險到期，獲得$150', action: 'MONEY', amount: 150 },
        { type: 'COMMUNITY_CHEST', title: '遺產', description: '繼承遺產，獲得$100', action: 'MONEY', amount: 100 },
        { type: 'COMMUNITY_CHEST', title: '出獄卡', description: '可用於出獄', action: 'GET_OUT_OF_JAIL' },
        { type: 'COMMUNITY_CHEST', title: '生日', description: '今天是你的生日，獲得$50', action: 'MONEY', amount: 50 },
        { type: 'COMMUNITY_CHEST', title: '稅單', description: '繳納稅款$100', action: 'MONEY', amount: -100 },
        { type: 'COMMUNITY_CHEST', title: '彩券中獎', description: '彩券中獎，獲得$200', action: 'MONEY', amount: 200 },
    ];
};

export const shuffleCards = (cards: Card[]): Card[] => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
