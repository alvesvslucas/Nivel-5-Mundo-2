import Editora from "../modelo/Editora";

const editoras: Array<Editora> = [
    { codEditora: 0, nome: "Abril" },
    { codEditora: 1, nome: "SM" },
    { codEditora: 2, nome: "Ática" }
];

export default class ControleEditora {
    getNomeEditora(codEditora: number): string {
        const editora = editoras
            .filter(editora => editora.codEditora === codEditora)
            .map(editora => editora.nome);

        return editora.length > 0 ? editora[0] : 'Desconhecida';
    }
    
    getEditoras(): Array<Editora> {
        return editoras;
    }
}