import { Injectable } from '@angular/core';
import Editora from './Editora';

@Injectable({
  providedIn: 'root'
})

export class ControleEditoraService {
  private editoras: Array<Editora> = [
    { codEditora: 0, nome: "Abril" },
    { codEditora: 1, nome: "SM" },
    { codEditora: 2, nome: "Ática" }
];

  constructor() {}

  getNomeEditora(codEditora: number): string {
    const editora = this.editoras
        .filter(editora => editora.codEditora === codEditora)
        .map(editora => editora.nome);

    return editora.length > 0 ? editora[0] : 'Desconhecida';
  }


  getEditoras(): Array<Editora> {
    return this.editoras;
  }

}
