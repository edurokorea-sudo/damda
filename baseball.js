'use strict';  //런타임에서 문제 코드가 있는 경우 에러 반환

const shortid = require('shortid');  //shortid: 외부 모듈로 짧은 랜덤 ID 생성기(7자리의 비순차적 랜덤값 생성)
const {getRandomInt} = require('./util.js'); //require('./util.js') → util.js 파일에서 내보낸 객체를 가져옴, { getRandomInt } → 그 객체에서 getRandomInt라는 함수만 꺼내옴
const answerSymbol = Symbol('answer');  //심볼(원시타입) : 유일하고 중복되지 않는 값을 생성할 때 사용, "answer라는 설명을 가진 고유한 심볼" 생성

class Baseball {
  constructor(id = shortid.generate(), history = [ ], done = false, answer, digit = 3) {
    this.id = id;
    this.history = history;
    this.done = done;
    this[answerSymbol] = answer || Baseball.makeAnswer(digit);
    this.digit = digit;
}
  getId() {
    return this.id;
  }  
  getAnswer() {
    return this[answerSymbol]
  }
  getDigit() {
    return this.digit;
  }
  getDone() {
    return this.done;
  }
  addHistory(result) {
    this.history.push(result);
  }
  setDone(done) {
    this.done = done;
  }
  
  matchAnswer(guess) { //guess:사용자 입력한 배열
    let strike = 0;
    let ball = 0;
    const answer = this.getAnswer(); //정답 배열 가져오기
    answer.forEach((v,i) => {
      if(guess[i] === v) {
        strike++;
      } else if(answer.indexOf(guess[i])> -1) {  //배열 안에서 그 값이 있는 첫 번째 위치(인덱스), 없으면 -1반환
        ball++;
      }
    });
    return new Result(strike, ball);
  }

static makeAnswer(digit) {  //static(정적메서드) 으로 선언된 메서드/프로퍼티는 클래스 자체에 속함.즉, 인스턴스(객체)에서 접근할 수 없고, 클래스 이름으로 직접 호출해야 함
  let problem = [], numbers = [0,1,2,3,4,5,6,7,8,9];
  for (let i=0; i<digit; i++) {
    let max = 9-i;
    let index = getRandomInt(0, max);
    problem.push(numbers[index]);
    numbers.splice(index, 1);  //array.splice(start, deleteCount, item1, item2, ...)배열에서 요소를 삭제/추가/교체할 수 있는 메서드
  }      //문제를 들어간 숫자는 제거해서 중복을 방지함.
  return problem;
}

//data를 받아서 베이스볼 객체를 만드는 메서드
static toObject(data) {
  const {id, history, done, answer, digit} = data;
  return new Baseball(id, history, done, answer, digit);
}

//원본 객체(this)는 그대로 두고 새로운 객체를 만들어 반환 → 불변성 유지
attachedAnswer() {
  return Object.assign({}, this, {answer: this.getAnswer()}); //Object.assign(target, ...sources)여러 개의 객체를 합쳐서 target에 복사하는 메서드
}
}

class Result {
  constructor(strike, ball) {
    this.strike = strike
    this.ball = ball;
  }

  toString() {
    let resultstring = `${this.strike}S${this.ball}B`;
    if (this.strike === 0 && this.ball=== 0) {
      resultstring = 'OUT';
    }
    return resultstring;
  }
}

module.exports = Baseball;

