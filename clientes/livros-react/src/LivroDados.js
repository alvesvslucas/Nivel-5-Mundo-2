import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Livro from "./modelo/Livro";
import ControleLivro from "./controle/ControleLivros";
import ControleEditora from "./controle/ControleEditora";

const controleLivro = new ControleLivro();
const controleEditora = new ControleEditora();

export default function LivroDados() {
  const opcoes = controleEditora.getEditoras().map((editora) => ({
    value: editora.codEditora,
    text: editora.nome,
  }));

  const [titulo, setTitulo] = useState(String);
  const [resumo, setResumo] = useState(String);
  const [autores, setAutores] = useState(String);
  const [codEditora, setCodEditora] = useState(0);

  const navigate = useNavigate();

  const tratarCombo = (e) => {
    setCodEditora(Number(e.target.value));
  };

  const incluir = (e) => {
    e.preventDefault();

    const novoLivro = new Livro();

    novoLivro.codEditora = codEditora;
    novoLivro.titulo = titulo;
    novoLivro.resumo = resumo;
    novoLivro.autores = autores.split("\n");

    controleLivro.incluir(novoLivro).then(() => navigate("/"))
  };

  return (
    <main>
        <h1 className="my-4 text-center">Dados do Livro</h1>
        <form className="row col-6 mx-auto" onSubmit={(e) => incluir(e)}>
          <div className="form-group">
            <label htmlFor="titulo">Título</label>
              <input
                required
                className="form-control"
                id="titulo"
                name="titulo"
                type="text"
                onChange={(e) => setTitulo(e.target.value)}
              />
          </div>
          <div className="form-group">
            <label htmlFor="resumo">Resumo</label>
              <textarea
                required
                className="form-control"
                id="resumo"
                onChange={(e) => setResumo(e.target.value)}
              />
          </div>
          <div className="form-group">
            <label htmlFor="editora">Editora</label>
              <select
                required
                className="form-control form-control-md"
                id="editora"
                onChange={(e) => tratarCombo(e)}
              >
                {opcoes.map((opcao, index) => (
                  <option key={index} value={opcao.value}>
                    {opcao.text}
                  </option>
                ))}
              </select>
          </div>
          <div className="form-group">
            <label htmlFor="autores">Autores (1 por linha)</label>
              <textarea
                required
                className="form-control"
                id="autores"
                onChange={(e) => setAutores(e.target.value)}
              />
          </div>
            <button className="btn btn-primary mt-4" type="submit" >Salvar Dados</button>
        </form>
    </main>
  );
}
