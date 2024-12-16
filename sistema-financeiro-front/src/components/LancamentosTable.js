import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./styles.css";


function LancamentosTable({ lancamentos, setLancamentos, mesSelecionado, anoSelecionado }) {
  const [formVisivel, setFormVisivel] = useState(false); // Controla a visibilidade do formulário
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [totais, setTotais] = useState({
    receita_pendente: 0,
    receita_paga: 0,
    despesa_pendente: 0,
    despesa_paga: 0,
  
  });

  const handleFilter = () => {
    const params = {};
    if (mes) params.mes = mes;
    if (ano) params.ano = ano;

    // Fetch both transactions and totals
    Promise.all([
      api.get("/lancamentos", { params }),
      api.get("/lancamentos/totais", { params }),
    ])
      .then(([lancamentosResponse, totaisResponse]) => {
        setLancamentos(lancamentosResponse.data);
        setTotais(totaisResponse.data);
      })
      .catch((error) => {
        console.error("Error filtering:", error);
      });
  };

  // Effect to synchronize local filter state with parent component's filters
  useEffect(() => {
    setMes(mesSelecionado);
    setAno(anoSelecionado);
  }, [mesSelecionado, anoSelecionado]);

  // Effect to fetch data when local filter state changes
  useEffect(() => {
    handleFilter();
  }, [ano, mes, lancamentos]);

  
  // Função para excluir lançamentos
  const handleDelete = (id) => {
    api
      .delete(`/lancamentos/${id}`)
      .then(() => {
        setLancamentos((prev) => prev.filter((l) => l.id !== id));
      })
      .catch((error) => console.error("Erro ao excluir lançamento:", error));
  };

  // Função para alterar o status
  const handleStatusChange = (id, novoStatus) => {
    api
      .patch(`/lancamentos/${id}/status`, { status: novoStatus })
      .then(() => {
        setLancamentos((prevLancamentos) =>
          prevLancamentos.map((lancamento) =>
            lancamento.id === id
              ? { ...lancamento, status: novoStatus }
              : lancamento
          )
        );
      })
      .catch((error) => console.error("Erro ao alterar status:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Cria um novo objeto com o status inicial como 'pendente'
    const novoLancamento = {

    };

    api
      .post("/lancamentos", novoLancamento)
        .then((response) => {
        setLancamentos((prev) => [
          ...prev,
          { ...novoLancamento, id: response.data.id },
        ]);
     
        setFormVisivel(false); // Oculta o formulário após o envio
      })
      .catch((error) => console.error("Erro ao adicionar lançamento:", error));
  };

  return (<>

  
  {/* Botão para mostrar ou ocultar o formulário */}
  <button onClick={() => setFormVisivel(!formVisivel)} style={{ marginBottom: "10px", backgroundColor: "red", textAlign: "center" }}>
        {formVisivel ? "Ocultar Filtro" : "Filtra Dados"}
      </button>

      {/* Renderiza o formulário apenas se formVisivel for true */}
      {formVisivel && (
        <form onSubmit={handleSubmit}>
          <select value={mes} onChange={(e) => setMes(e.target.value)}>
          <option value="">Selecione o mês</option>
          <option value="01">Janeiro</option>
          <option value="02">Fevereiro</option>
          <option value="03">Março</option>
          <option value="04">Abril</option>
          <option value="05">Maio</option>
          <option value="06">Junho</option>
          <option value="07">Julho</option>
          <option value="08">Agosto</option>
          <option value="09">Setembro</option>
          <option value="10">Outubro</option>
          <option value="11">Novembro</option>
          <option value="12">Dezembro</option>
          </select>
        <select value={ano} onChange={(e) => setAno(e.target.value)}>
          <option value="">Selecione o ano</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          </select>
        {/*<button onClick={handleFilter}>Filtrar</button>*/}
        </form>
      )}
   
    <div>
      {/* Filtros de mês e ano */}    
      
      {/*lista dos totais gerais e totais via filtro*/}

      <div>
        <h3>Resumo Financeiro</h3>
        <div className="totais">
          <div className="totais_receitas">
            <h4>Receitas</h4>
            <p>
              <strong>Pendentes:</strong> R$ {totais.receita_pendente.toFixed(2)}
            </p>
            <p>
              <strong>Pagas:</strong> R$ {totais.receita_paga.toFixed(2)}
            </p>
          </div>
          <div className="totais_despesas">
            <h4>Despesas</h4>
            <p>
              <strong>Pendentes 123:</strong> R$ {totais.despesa_pendente.toFixed(2)}
            </p>
            <p>
              <strong>Pagas:</strong> R$ {totais.despesa_paga.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      </div>


      {/* Tabela de lançamentos */}
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Lançamento</th>
            <th>Vencimento</th>
            <th>Ações</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {lancamentos.map((lancamento) => (
            <tr key={lancamento.id}>
              <td>{lancamento.descricao}</td>
              <td>R$ {lancamento.valor.toFixed(2)}</td>
              <td>{lancamento.tipo}</td>
              <td>{lancamento.data_lancamento}</td>
              <td>{lancamento.data_vencimento || "Não informado"}</td>
              <td>
                <button onClick={() => handleDelete(lancamento.id)}>
                  Excluir
                </button>
              </td>
              <td>
                {lancamento.status === "pendente" && (
                  <button
                    className="btn-pago"
                    onClick={() =>
                      handleStatusChange(lancamento.id, "pago")
                    }
                  >
                    Marcar como Pago
                  </button>
                )}
                {lancamento.status === "pago" && <span>✅ Pago</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
 
</>)};

export default LancamentosTable;     
   