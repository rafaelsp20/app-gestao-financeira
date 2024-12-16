const express = require("express");
const router = express.Router();
const db = require("../db/database");

// Listar lançamentos com filtro de mês e ano
router.get("/", (req, res) => {
  const { mes, ano } = req.query;

  let sql = "SELECT * FROM lancamentos";
  const params = [];

  if (mes && ano) {
    sql += " WHERE strftime('%m', data_vencimento) = ? AND strftime('%Y', data_vencimento) = ?";
    params.push(mes.toString().padStart(2, "0"), ano);
  } else if (mes) {
    sql += " WHERE strftime('%m', data_vencimento) = ?";
    params.push(mes.toString().padStart(2, "0"));
  } else if (ano) {
    sql += " WHERE strftime('%Y', data_vencimento) = ?";
    params.push(ano);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Criar um novo lançamento
router.post("/", (req, res) => {
  const { descricao, valor, tipo, status, data_vencimento, data_lancamento } = req.body;

  const sql = `
    INSERT INTO lancamentos (descricao, valor, tipo, status, data_vencimento, data_lancamento)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    descricao,
    valor,
    tipo,
    status || "pendente",
    data_vencimento || null,
    data_lancamento || new Date().toISOString().split("T")[0], // Data atual padrão
  ];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
});

// Atualizar um lançamento
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { descricao, valor, tipo, status, data_vencimento, data_lancamento } = req.body;

  const sql = `
    UPDATE lancamentos
    SET descricao = ?, valor = ?, tipo = ?, status = ?, data_vencimento = ?, data_lancamento = ?
    WHERE id = ?
  `;
  const params = [descricao, valor, tipo, status, data_vencimento, data_lancamento, id];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Lançamento não encontrado." });
    } else {
      res.status(200).json({ updated: this.changes });
    }
  });
});

// Excluir um lançamento
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM lancamentos WHERE id = ?`;

  db.run(sql, id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Lançamento não encontrado." });
    } else {
      res.status(200).json({ deleted: this.changes });
    }
  });
});

// Atualizar status de um lançamento
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pendente", "pago"].includes(status)) {
    return res.status(400).json({ error: "Status inválido. Use 'pendente' ou 'pago'." });
  }

  const sql = `UPDATE lancamentos SET status = ? WHERE id = ?`;

  db.run(sql, [status, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Lançamento não encontrado." });
    } else {
      res.status(200).json({ message: "Status atualizado com sucesso." });
    }
  });
});

// Obter totais com base nos filtros de mês e ano
router.get("/totais", (req, res) => {
  const { mes, ano } = req.query;

  console.log("Parâmetros recebidos para filtro:", { mes, ano });

  let sql = `
    SELECT
      SUM(CASE WHEN tipo = 'receita' AND status = 'pendente' THEN valor ELSE 0 END) AS receita_pendente,
      SUM(CASE WHEN tipo = 'receita' AND status = 'pago' THEN valor ELSE 0 END) AS receita_paga,
      SUM(CASE WHEN tipo = 'despesa' AND status = 'pendente' THEN valor ELSE 0 END) AS despesa_pendente,
      SUM(CASE WHEN tipo = 'despesa' AND status = 'pago' THEN valor ELSE 0 END) AS despesa_paga
    FROM lancamentos
  `;

  const params = [];

  if (mes) {
    sql += " WHERE strftime('%m', data_vencimento) = ?";
    params.push(mes.padStart(2, "0"));
  }
  if (ano) {
    sql += mes ? " AND " : " WHERE ";
    sql += "strftime('%Y', data_vencimento) = ?";
    params.push(ano);
  }

  console.log("SQL gerado:", sql);
  console.log("Parâmetros SQL:", params);

  // Tentativa de execução da query
  try {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error("Erro ao executar a consulta SQL:", err);
        res.status(500).json({ error: err.message });
      } else {
        console.log("Resultado da consulta SQL:", row);
        res.status(200).json({
          receita_pendente: row.receita_pendente || 0,
          receita_paga: row.receita_paga || 0,
          despesa_pendente: row.despesa_pendente || 0,
          despesa_paga: row.despesa_paga || 0,
        });
      }
    });
  } catch (error) {
    console.error("Erro inesperado:", error);
    res.status(500).json({ error: "Erro inesperado ao processar a requisição." });
  }
});


module.exports = router;
