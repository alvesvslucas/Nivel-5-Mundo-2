import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Menu } from '@/componente/Menu';
import {LinhaLivro} from '@/componente/LinhaLivro';
import Livro from '@/classes/modelo/Livro';
import styles from '../styles/Home.module.css'
import ControleLivro from '@/classes/controle/ControleLivros';

const baseURL = "http://localhost:3000/api/livros";

const controleLivros = new ControleLivro();

const LivroLista = () => {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const obterTodos = async () => {
      await controleLivros.obterLivros().then((resultado) => {
        setLivros(resultado)
      })
    };
    obterTodos();
    setCarregado(true)
  }, [carregado])

  const excluirLivro = async (codigo: String) => {
    const resposta = await fetch(`${baseURL}/${codigo}`, {
      method: 'DELETE'
    });
    return resposta.ok;
  }

  const excluir = (codigo: String) => {
    controleLivros.excluir(codigo).then(() => setCarregado(false));
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Loja Next</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Menu />
      <main className='container'>
      <h1 className='text-center py-4'>Livros</h1>
        <table className='container-fluid'>
        <thead>
          <tr className='text-light bg-dark col'>
            <th className='p-3 col-2 '>Título</th>
            <th className='p-3 col-7'>Resumo</th>
            <th className='p-3 col-1'>Editora</th>
            <th className='p-3 col-2'>Autores</th>
          </tr>
        </thead>
          <tbody>
            {livros.map((livro, index) => (
              <LinhaLivro
                key={index}
                livro={livro}
                excluir={() => excluir(livro.codigo)}
              />
            ))}
          </tbody>
        </table>
        {livros.length <= 0 ? (<h2 className='text-center py-5'>Estoque de livros vazio 😢</h2>) : (<></>)}
      </main>
    </div>
  );
};

export default LivroLista;
