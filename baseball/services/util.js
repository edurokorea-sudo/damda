// services/util.js (CommonJS)
function makeUniqueDigits(len = 3) {
  const digits = [];
  while (digits.length < len) {
    const d = Math.floor(Math.random() * 10);
    if (digits.length === 0 && d === 0) continue; // 맨 앞 0 방지(원하면 제거)
    if (!digits.includes(d)) digits.push(d);
  }
  return digits;
}

function toDigits(nStr) {
  return String(nStr).split('').map(x => parseInt(x, 10));
}

function judge(answerDigits, guessDigits) {
  let strike = 0, ball = 0;
  for (let i = 0; i < guessDigits.length; i++) {
    if (guessDigits[i] === answerDigits[i]) strike++;
    else if (answerDigits.includes(guessDigits[i])) ball++;
  }
  const out = guessDigits.length - strike - ball;
  return { strike, ball, out };
}

function isValidGuess(nStr, len = 3) {
  if (!/^\d+$/.test(nStr)) return false;
  if (nStr.length !== len) return false;
  const s = new Set(nStr.split(''));
  return s.size === len; // 중복 숫자 금지
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // min 이상 max 이하 정수
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  makeUniqueDigits,
  toDigits,
  judge,
  isValidGuess,
  getRandomInt,
};
