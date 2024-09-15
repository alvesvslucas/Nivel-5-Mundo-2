import { Injectable } from '@angular/core';
import Livro from './Livro';

const baseURL = 'http://localhost:3030/livros';

interface LivroMongo {
  _id: string | null;
  codEditora: number;
  titulo: string;
  resumo: string;
  autores: string[];
}

@Injectable({
  providedIn: 'root',
})
export default class ControleLivro {
  obterLivros = async() => {
      try {
          const res = await fetch(baseURL, {method: "GET"});
          const livrosJson: LivroMongo[] = await res.json();
          const livros = livrosJson.map((item) => {
              return new Livro(
                  item._id ?? '',
                  item.codEditora,
                  item.titulo,
                  item.resumo,
                  item.autores
              );
          });
          return livros;
      } catch(erro) {
          console.error('Erro ao obter livros: ', erro);
          return []
      }
  }

  incluir = async (livro: Livro) => {
      try {
        const livroMongo = {
          titulo: livro.titulo,
          codEditora: livro.codEditora,
          resumo: livro.resumo,
          autores: livro.autores,
        };

        const res = await fetch(baseURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(livroMongo),
        });

        const result = await res.json();

        return result.ok;
      } catch (err) {
        console.error("Error ao cadastrar livro: ", err);
        return false;
      }
    };

  excluir = async (codigo: String) => {
      try {
        const res = await fetch(`${baseURL}/${codigo}`, { method: "DELETE" });

        const data = await res.json();
        if (res.ok) {
          return data.ok;
        } else {
          throw new Error(`Erro ao excluir livro: ${res.status}`);
        }
      } catch (err) {
        console.error("Erro ao exculir livro: ", err);
        return false;
      }
  };
}
