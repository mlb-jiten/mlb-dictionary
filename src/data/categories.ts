export const categories = {
    roster: {
        name: 'ロースター',
        description: '選手の登録枠やロースター運用に関する用語',
    },

    transactions: {
        name: 'トランザクション',
        description: '選手の移籍や登録変更の手続きに関する用語',
    },

    contracts: {
        name: '契約',
        description: '選手契約や年俸に関する用語',
    },

    draft: {
        name: 'ドラフト',
        description: 'ドラフト制度や選手の指名に関する用語',
    },

    prospects: {
        name: 'プロスペクト',
        description: '若手有望選手の評価などに関する用語',
    },

    stats: {
        name: '指標',
        description: '選手やチームの成績を評価する指標に関する用語',
    },

    rules: {
        name: 'ルール',
        description: 'MLBの試合や競技規則に関する用語',
    },
} as const;

export type CategoryId = keyof typeof categories;