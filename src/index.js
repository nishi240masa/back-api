// server.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // MySQLユーザー名
  password: 'password', // MySQLパスワード
  database: 'your_database_name', // 作成したデータベース名
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.get('/', (req, res) => {
  res.send('Hello, API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
