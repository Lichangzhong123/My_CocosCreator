window.G = {
    Score: 0, //分数
    GameOver: false, //游戏是否结束
    isAddScore: false,
    IsProp: false,
    moveSpeed: {
        0: 1,
        1: 1.5,
        2: 2,
        3: 2.5,
        4: 3,
        5: 3.5,
        6: 4,
        7: 4.5,
        8: 5,
        9: 5.5,
        10: 6,
        11: 6.5,
        12: 7,
        13: 7.5,
        14: 8,
        15: 8.5,
        16: 9,
        17: 9.5,
        18: 10,
        19: 10.5,
        20: 11,
        21: 11.5,
        22: 12,
        23: 12.5,
        24: 13,
        25: 13.5,
    }, //怪物的移动速度系数随着分数的增加而增加
    enemy0: {
        name: 'enemy0',
        value: 30,
        speed: 6
    },
    enemy1: {
        name: 'enemy1',
        value: 50,
        speed: 4
    },
    prop0: {
        name: ''
    },
    prop1: {
        name: ''
    },

}