import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./styles.css";

function Dashboard({ mesSelecionado, anoSelecionado, lancamentos }) {
  const [totais, setTotais] = useState({
    receita_pendente: 0,
    receita_paga: 0,
    despesa_pendente: 0,
    despesa_paga: 0,
  });

  // Função para buscar os totais do servidor com base nos filtros
  const fetchTotais = (mes, ano) => {
    api
      .get("/lancamentos/totais", {
        params: {
          mes: mes || "", // Mês selecionado ou vazio
          ano: ano || "", // Ano selecionado ou vazio
        },
      })
      .then((response) => {
        setTotais(response.data); // Atualiza os totais no estado
        console.log("Totais atualizados com base no filtro:", response.data);
      })
      .catch((error) => console.error("Erro ao buscar totais:", error));
  };

  // Chama fetchTotais sempre que os filtros ou lançamentos mudam
  useEffect(() => {
    fetchTotais(mesSelecionado, anoSelecionado);
  }, [mesSelecionado, anoSelecionado, lancamentos]); // Recarrega os totais ao mudar os filtros ou lançamentos

  return (
    <div>
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
              <strong>Pendentes:</strong> R$ {totais.despesa_pendente.toFixed(2)}
            </p>
            <p>
              <strong>Pagas:</strong> R$ {totais.despesa_paga.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

