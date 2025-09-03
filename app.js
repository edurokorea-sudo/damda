var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apiRouter = require('./routes/api');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/game', apiRouter);

// 서버 시작 직전 초기화 로직
require('./services/index').readyGame();

// 404 핸들러 (API는 JSON)
app.use((req, res, next) => {
  const isApi = req.originalUrl.startsWith('/api/');
  if (isApi) return res.status(404).json({ message: 'Not Found' });
  next(createError(404));
});

// 에러 핸들러 (API는 JSON)
app.use((err, req, res, next) => {
  const status = err.status || err.code || 500;
  const isApi = req.originalUrl.startsWith('/api/');
  if (isApi) return res.status(status).json({ message: err.message || 'Internal Server Error' });
  res.status(status).send(err.message || 'Internal Server Error');
});

const PORT = process.env.PORT || 3000;     // 🔴 Render 필수
const HOST = '0.0.0.0';                    // 🔴 Render 필수(외부접속 허용)

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection', err);
  process.exit(1);
});

module.exports = app;
