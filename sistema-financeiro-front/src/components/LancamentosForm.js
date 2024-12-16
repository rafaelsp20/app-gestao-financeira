import React, { useState } from "react";
import api from "../services/api";

function LancamentosForm({ setLancamentos }) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");
  const [dataVencimento, setDataVencimento] = useState("");
  const [dataLancamento, setDataLancamento] = useState("");
  const [formVisivel, setFormVisivel] = useState(false); // Controla a visibilidade do formulário

  const handleSubmit = (e) => {
    e.preventDefault();

    // Cria um novo objeto com o status inicial como 'pendente'
    const novoLancamento = {
      descricao,
      valor: parseFloat(valor),
      tipo,
      status: "pendente",
      data_lancamento: dataLancamento || new Date().toISOString().split("T")[0],
      data_vencimento: dataVencimento || null,
    };

    api
      .post("/lancamentos", novoLancamento)
        .then((response) => {
        setLancamentos((prev) => [
          ...prev,
          { ...novoLancamento, id: response.data.id },
        ]);
        setDescricao("");
        setValor("");
        setTipo("receita");
        setDataLancamento("");
        setDataVencimento("");
        setFormVisivel(false); // Oculta o formulário após o envio
      })
      .catch((error) => console.error("Erro ao adicionar lançamento:", error));
  };

  return (
    <div>
      {/* Botão para mostrar ou ocultar o formulário */}
      <button onClick={() => setFormVisivel(!formVisivel)} style={{ marginBottom: "10px" }}>
        {formVisivel ? "Ocultar Formulário" : "Novo Lançamento"}
      </button>

      {/* Renderiza o formulário apenas se formVisivel for true */}
      {formVisivel && (
        <form onSubmit={handleSubmit}>
          <h2>Novo Lançamento teste</h2>
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
          <input
            type="date"
            placeholder="Data de Vencimento"
            value={dataVencimento}
            onChange={(e) => setDataVencimento(e.target.value)}
          />
          <button type="submit">Adicionar</button>
        </form>
      )}
    </div>
  );
}

export default LancamentosForm;
