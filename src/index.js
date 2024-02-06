// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;;

app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || process.env.DB_,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

});

pool.connect();


// recordsテーブルを作成するSQLクエリ
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS records (
    id SERIAL PRIMARY KEY,          // 自動生成される主キー
    dateKey VARCHAR(255) NOT NULL,  // 作業日付を表すキー
    salary INT NOT NULL,             // 給与
    hours INT NOT NULL               // 労働時間
  );
`;

// テーブルの作成を実行
pool.query(createTableQuery, (err, result) => {
  if (err) {
    console.error('テーブルの作成エラー:', err);
  } else {
    console.log('テーブルが正常に作成されました');
  }
});

// レコードを挿入するAPIエンドポイント
app.post('/api/records', async (req, res) => {
  const { dateKey, salary, hours } = req.body;

  try {
    // レコードを挿入し、挿入されたデータを返す
    const result = await pool.query(
      'INSERT INTO records (dateKey, salary, hours) VALUES ($1, $2, $3) RETURNING *',
      [dateKey, salary, hours]
    );

    console.log('レコードが正常に挿入されました');
    res.status(201).json({ message: 'レコードが正常に作成されました', data: result.rows[0] });
  } catch (error) {
    console.error('レコードの挿入エラー:', error);
    res.status(500).json({ message: '内部サーバーエラー' });
  }
});

// サーバーを指定されたポートで起動
app.listen(port, () => {
  console.log(`サーバーがポート${port}で実行されています`);
});
