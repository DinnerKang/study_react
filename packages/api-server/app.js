var express = require('express');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(express.urlencoded( {extended : false } )); 
app.use(express.json()); //json 형태로 parsing

let fetch = 0;
const users = [
  { id: 1, name: 'test1'},
  { id: 2, name: 'test2'},
  { id: 3, name: 'test3'},
  { id: 4, name: 'test4'},
];

app.get('/users', function(req,res) {
  console.log('get users', fetch);
  fetch += 1;
  res.send(users);
});

app.post('/user', (req, res) => {
  console.log('add user');
  const { body } = req;
  console.log(body);
  users.push(body);
  res.send(`id:${body.id} name:${body.name} 추가 성공`);
});

// 3000 포트로 서버 오픈
app.listen(8000, function() {
    console.log("start! express server on port 8000")
});