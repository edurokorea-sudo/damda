'use strict';

const Baseball = require('./baseball.js');
const model = require('../models');

const getGames = () => {
    const games = {};
    const data = model.readFile();

    for(let key in data) {
        if(!data.hasOwnProperty(key)) continue;  //객체 data 안에 key라는 이름의 속성이 있는지 확인하는 함수.
        games[key] = Baseball.toObject(data[key]);
    }
    return games;
};

exports.getGames = () => { //내보내기
    return Object.values(getGames());  //객체의 **값(value)**만 배열로 뽑아내는 메서드.
};

const getGame = exports.getGame = (id) => {
    if (!id) throw 'id를 입력하세요.';
    
    const games = getGames();
    const game = games[id];
    if (!game) throw '해당하는 게임 정보가 없습니다.';
    return game;
};

exports.makeGame = (digit) => {
    const baseball = new Baseball(undefined, undefined, undefined, undefined, digit);
    const id = baseball.getId();
    const data = model.readFile() || {};
    data[`${id}`] = baseball.attachedAnswer();
    model.writeFile(JSON.stringify(data));
    return baseball.getId();
};

exports.guessAnswer = (id, guess) => {
    if (!id) throw 'id를 입력하세요.';
    if(!guess || !guess.length) throw '숫자를 입력하세요.';
    
    const fileData = model.readFile() || {};
    if(!fileData[id]) throw '해당하는 게임 정보가 없습니다.';
    
    const game = getGame(id);
    if(+game.getDigit() !== guess.length) throw '해당 게임에 지정된 자리수와 일치하지 않습니다.'; // //+값 → 그 값을 **숫자형(number)**으로 변환하려고 시도함.
    
    const result = game.matchAnswer(guess);
    const history = {guess:guess.join(''), result: result.toString()};
    game.addHistory(history);
    game.setDone(+game.getDigit() === result.strike) 

    fileData[id] = game.attachedAnswer();
    model.writeFile(fileData);

    return Object.assign({done:game.getDone()}, history);  //.assign(target, ...sources)배열을 합칠때
};

exports.readyGame = () => {
    try {
        model.readFile();
    }catch(err) {
        model.writeFile({});
    }
};

exports.removeGame = (id) => {
    if (!id) throw 'id를 입력하세요.';

    const fileData =model.readFile() || {};
    if(!fileData[id]) throw '해당하는 게임 정보가 없습니다.';

    delete fileData[id];
    model.writeFile(fileData);

    return getGames();
};

