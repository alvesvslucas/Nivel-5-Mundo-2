import { useState, useEffect } from "react";
import ControleEditora from "@/classes/controle/ControleEditora";
import Livro from "@/classes/modelo/Livro";

const controleEditora = new ControleEditora();

interface LinhaLivroProps {
  livro: Livro;
  excluir(): void;
}

export const LinhaLivro: React.FC<LinhaLivroProps> = (props) => {
  const [nomeEditora, setNomeEditora] = useState<string>("");

  const {livro, excluir} = props;

  useEffect(() => {
    async function fetchEditoraName() {
      const nome = controleEditora.getNomeEditora(livro.codEditora);
      if (nome) {
        setNomeEditora(nome);
      }
    }

    fetchEditoraName();
  }, [livro.codEditora]);

  return (
    <tr>
      <td className='border-bottom text-center py-2'>
        {livro.titulo}
        <br />
        <button onClick={excluir} className="btn btn-danger">Excluir</button>
      </td>
      <td className='border-bottom py-2' style={{textAlign: 'justify'}}>{livro.resumo}</td>
      <td className='border-bottom py-2 text-center'>{nomeEditora}</td>
      <td className='border-bottom py-2'>
        <ul>
          {livro.autores &&
            livro.autores.map((autor, index) => <li key={index}>{autor}</li>)}
        </ul>
      </td>
    </tr>
  );
};
