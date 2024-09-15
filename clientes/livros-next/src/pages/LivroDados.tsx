import React from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import ControleEditora from "@/classes/controle/ControleEditora";
import Livro from "@/classes/modelo/Livro";
import Head from "next/head";
import { Menu } from "@/componente/Menu";
import styles from '../styles/Home.module.css'
import ControleLivro from "@/classes/controle/ControleLivros";

const LivroDados = () => {
  const controleLivros = new ControleLivro();
  const controleEditora = new ControleEditora();

  const [codEditora, setCodEditora] = useState<number>(0);
  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [autores, setAutores] = useState("");
  const navigate = useRouter().push;

  const opcoes = controleEditora.getEditoras().map((editora) => ({
    value: editora.codEditora, 
    text: editora.nome
  }));

  function tratarCombo(event: React.ChangeEvent<HTMLSelectElement>) {
    setCodEditora(Number(event.target.value));
  }

  const incluir = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const livro = new Livro(
        '',
        codEditora,
        titulo,
        resumo,
        autores.split('\n'),
    );
    controleLivros.incluir(livro).then(() => navigate("/LivroLista"))
};

  return (
    <div className={styles.container}>
      <Head>
        <title>Novo Livro</title>
      </Head>

      <Menu />

      <main className={styles.main}>
        <h1 className='my-4 text-center'>Dados do Livro</h1>
        <form onSubmit={incluir} className="row col-6 mx-auto">
          <div className="form-group">
            <label htmlFor="titulo">Título:</label>
            <input 
              required 
              className="form-control" 
              id="titulo" 
              type="text" 
              value={titulo} 
              onChange={(event) => setTitulo(event.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="resumo">Resumo:</label>
            <textarea 
              required 
              id="resumo"
              className="form-control" 
              value={resumo} 
              onChange={(event) => setResumo(event.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="codEditora">Editora:</label>
            <select 
              required 
              id="codEditora" 
              className="form-control" 
              value={codEditora} 
              onChange={tratarCombo}
            >
              <option value="">Selecione</option>
              {opcoes.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.text}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="autores">Autores:</label>
            <textarea 
              required 
              id="autores" 
              className="form-control" 
              value={autores} 
              onChange={(event) => setAutores(event.target.value)} 
            />
          </div>
          <button type="submit" className="btn btn-primary mt-4">Salvar Dados</button>
        </form>
    </main>
    </div>
  );
}

export default LivroDados;