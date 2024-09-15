import ControleLivros from "./controle/ControleLivros";
import ControleEditora from "./controle/ControleEditora";
import { useEffect, useState } from "react";

const controleLivro = new ControleLivros();
const controleEditora = new ControleEditora();

function LinhaLivro(props) {
  const { livro, excluir } = props;
  const nomeEditora = controleEditora.getNomeEditora(livro.codEditora);

  return (
    <tr>
      <td className='border-bottom text-center py-2'>
        {livro.titulo}
        <div>
          <button className="btn btn-danger" onClick={excluir}>
            Excluir
          </button>
        </div>
      </td>
      <td className='border-bottom py-2'>{livro.resumo}</td>
      <td className='border-bottom py-2 text-center'>{nomeEditora}</td>
      <td className='border-bottom py-2'>
        <ul>
          {livro.autores.map((autor, index) => {
            return <li key={index}>{autor}</li>;
          })}
        </ul>
      </td>
    </tr>
  );
}

export default function LivroLista() {
  const [livros, setLivros] = useState([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const obterTodos = async () => {
      await controleLivro.obterLivros().then((res) => {
        setLivros(res);
      });
    };
    obterTodos();
    setCarregado(true);
  }, [carregado]);

  const excluir = (codigo) => {
    controleLivro.excluir(codigo).then(setCarregado(false));
  };

  return (
    <main className='container'>
      <h1 className='text-center py-4'>Catálogo de Livros</h1>
      <table className='container-fluid'>
        <thead>
          <tr className='text-light bg-dark col'>
            <th className='p-3 col-2 '>Título</th>
            <th className='p-3 col-7 '>Resumo</th>
            <th className='p-3 col-1 '>Editora</th>
            <th className='p-3 col-2 '>Autores</th>
          </tr>
        </thead>
        <tbody>
          {livros.map((livro, index) => (
            <LinhaLivro
              livro={livro}
              excluir={() => excluir(livro.codigo)}
              key={index}
            />
          ))}
        </tbody>
      </table>
      {livros.length <= 0 && (<h2 className='text-center py-5'>Estoque de livros vazio 😢</h2>)}
    </main>
  );
}
