'use strict';

const fs = require('fs');
const path = require('path');

const FILEPATH = path.join(__dirname, 'data.json');

exports.readFile = () => {
    try{
        fs.openSync(FILEPATH,'r');  //파일을 동기(synchronous) 방식으로 열어서 **파일 디스크립터(fd)**를 반환함.
        const data = fs.readFileSync(FILEPATH, 'utf-8');  //지정한 파일을 동기(synchronous) 방식으로 읽음
        return JSON.parse(data);
    }catch (err) {
        throw err;
    }
};

const writeFile = exports.writeFile = (data) => {
  if (typeof data !== 'string') data = JSON.stringify(data);
  try {
    // 파일이 없으면 생성, 있으면 덮어씀
    fs.writeFileSync(FILEPATH, data, { encoding: 'utf8', flag: 'w' });
  } catch (err) {
    throw err;
  }
};