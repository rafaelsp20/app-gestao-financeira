import React, { useState, useEffect } from "react";
import api from "./services/api";
import LancamentosForm from "./components/LancamentosForm";
import LancamentosTable from "./components/LancamentosTable";
import Dashboard from "./components/Dashboard";

function App() {
  
   //antigo e funcionando
  
  const [lancamentos, setLancamentos] = useState([]);
  //const [mesSelecionado, setMesSelecionado] = useState(""); // Inicialmente vazio
  //const [anoSelecionado, setAnoSelecionado] = useState(""); // Inicialmente vazio
  //const [lancamentos, setLancamentos] = useState([]); // Simulação de lançamentos

  // Carregar lançamentos na inicialização
  //antigo e funcionando
  useEffect(() => {
    api.get("/lancamentos")
      .then((response) => setLancamentos(response.data))
      .catch((error) => console.error("Erro ao buscar lançamentos:", error));
  }, []);
  //antigo e funcionando

  return (
    <div className="App">     
      <h1>Gestão Financeira</h1> 
      <LancamentosForm setLancamentos={setLancamentos} />
      <LancamentosTable lancamentos={lancamentos} setLancamentos={setLancamentos} />
  </div>
  );
}

export default App;
