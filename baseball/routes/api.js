'use strict'

const express = require('express');
const services = require('../services');  //.. = 부모(상위) 디렉터리, . = 현재 디렉터리
const createError = require('http-errors');

const router = express.Router();

router.route('/list')  ///list 경로로 GET 요청이 들어오면 getlist 함수를 실행
   .get(getlist);
router.route('/')
   .post(makeGame);
router.route('/:id')
   .get(getGame)
   .delete(deleteGame);
router.route('/:id/guess')
   .post(postGuess);

const checkError = (err) => {
    return err.code ? err : createError(500,err);
};

//비동기 함수: 물 끓으라고 올려두고, 그동안 김치 꺼내기·그릇 준비하기를 할 수 있는 상황(서버 가동에 필수적, 프로그램이 여러 일을 동시에 처리할 수 있게)
//동기 함수: 라면 끓일 때 물 끓는 걸 계속 지켜보고 있어야 하는 상황 (순차적)
async function getlist(req, res, next) {  //async 는 함수 앞에 붙여서, 그 함수를 비동기 함수(Async Function) 로 만들어 주는 키워드
    try {
        res.send(services.getGames());
    } catch (err) {
        next(checkError(err));
    }
}

async function makeGame(req, res, next) {
   const digit = req.body.digit;
   try {
    const id = services.makeGame(digit);
    res.send({id});
   }catch (err) {
    next(checkError(err));
   }
}

async function getGame(req, res, next) {
  const id = req.params.id;
  try {
    res.send(services.getGame(id)); // ★ getGames → getGame
  } catch (err) {
    next(err);
  }
}

//문자열을 숫자로 변환해서~~
async function postGuess(req, res, next) {
    const guess = req.body.guess ? req.body.guess.split('').map(g => +g) : [];  //.split('')문자열을 글자 단위로 잘라서 배열로 바꿈.예) "1234".split('') → ["1", "2", "3", "4"]
    const id = req.params.id;                                   //.map(g => +g)배열의 각 요소를 숫자로 변환.["1", "2", "3", "4"].map(g => +g) → [1, 2, 3, 4]
    try {
        res.send(services.guessAnswer(id, guess));
    } catch (err) {
        next(checkError(err));
    }
}

async function deleteGame(req, res, next) {
    const id = req.params.id;
    try {
        res.send(services.removeGame(id));
    }catch (err) {
        next(checkError(err));
    }
}

module.exports = router;


