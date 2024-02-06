// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || process.env.DB_,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect(err => {
  if (err) {
    console.error('データベースへの接続エラー:', err);
  } else {
    console.log('データベースに正常に接続されました');
  }
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS records (
    id SERIAL PRIMARY KEY,
    dateKey VARCHAR(255) NOT NULL,
    salary INT NOT NULL,
    hours INT NOT NULL
  );
`;

pool.query(createTableQuery, (err, result) => {
  if (err) {
    console.error('テーブルの作成エラー:', err);
  } else {
    console.log('テーブルが正常に作成されました');
  }
});

app.post('/api/records', async (req, res) => {
  const { dateKey, salary, hours } = req.body;

  console.log('dateKey:', dateKey);
  console.log('salary:', salary);
  console.log('hours:', hours);

  try {
    const result = await pool.query(
      'INSERT INTO records (dateKey, salary, hours) VALUES ($1, $2, $3) RETURNING *',
      [dateKey, salary, hours]
    );

    console.log('レコードが正常に挿入されました');
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('レコードの挿入エラー:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`サーバーがポート${port}で実行されています`);
});
