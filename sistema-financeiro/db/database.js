const sqlite3 = require("sqlite3").verbose();

// Conectar ao banco de dados
const db = new sqlite3.Database("./financeiro.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conectado ao SQLite3.");
  }
});

// Criar a tabela se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS lancamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      valor REAL NOT NULL,
      tipo TEXT CHECK(tipo IN ('receita', 'despesa')) NOT NULL,
      status TEXT CHECK(status IN ('pendente', 'pago')) DEFAULT 'pendente',
      data_lancamento DATE DEFAULT (DATE('now')),
      data_vencimento DATE
    )
  `);
});

module.exports = db;


