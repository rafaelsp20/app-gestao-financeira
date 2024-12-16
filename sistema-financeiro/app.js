const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const lancamentosRoutes = require("./routes/lancamentos");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotas da API
app.use("/api/lancamentos", lancamentosRoutes);

/* Middleware para tratar rotas inexistentes na API
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Rota não encontrada na API." });
});*/

// Tratamento de erros globais
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err);
  res.status(500).json({ error: "Erro interno do servidor." });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
