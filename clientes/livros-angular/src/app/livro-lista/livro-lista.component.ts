import { Component, OnInit } from '@angular/core';
import Editora from '../Editora';
import Livro from '../Livro';
import { ControleEditoraService } from '../controle-editora.service';
import ControleLivrosService from '../controle-livros.service';

@Component({
  selector: 'app-livro-lista',
  templateUrl: './livro-lista.component.html',
  styleUrl: './livro-lista.component.css',
})
export class LivroListaComponent implements OnInit {
  public editoras: Array<Editora> = [];
  public livros: Array<Livro> = [];

  private servEditora: ControleEditoraService;
  private servLivros: ControleLivrosService;

  constructor(
    servEditora: ControleEditoraService,
    servLivros: ControleLivrosService
  ) {
    this.servEditora = servEditora;
    this.servLivros = servLivros;
  }

  ngOnInit(): void {
    this.editoras = this.servEditora.getEditoras();
    const obterTodos = async () => {
      try {
        await this.servLivros.obterLivros().then((dados) => {
          this.livros = dados;
        });
      } catch (err) {
        console.error('Error ao obter livros:', err);
      }
    };

    obterTodos();
  }

  excluir = (codigo: String) => {
    this.servLivros.excluir(codigo).then(async () => {
      try {
        await this.servLivros.obterLivros().then((dados) => {
          this.livros = dados;
        });
      } catch (err) {
        console.error('Error ao obter livros:', err);
      }
    });
  };

  obterNome = (codEditora: number) => {
    return this.servEditora.getNomeEditora(codEditora);
  };
}
