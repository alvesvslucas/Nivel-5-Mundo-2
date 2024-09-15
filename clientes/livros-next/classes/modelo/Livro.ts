export default class Livro {
    constructor(
        public codigo: string = '', 
        public codEditora: number,
        public titulo: string, 
        public resumo: string, 
        public autores: string[]
    ) {}
  }