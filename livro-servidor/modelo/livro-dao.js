const Livro = require('./livro-schema');

const obterLivros = async () => {
    try {
        const livros = await Livro.find();
    	return livros;
    } catch (error) {
        console.error("Error ao obter lista de livros: ", error);
		return [];
    }
};

const incluir = async (livro) => {
    try {
        await Livro.create(livro);
    } catch (error) {
        console.error("Error ao obter lista de livros: ", error);
    }
};

const excluir = async (codigo) => {
    try {
        await Livro.deleteOne({ _id: codigo });
    } catch (error) {
        console.error("Error ao excluir livro: ", error);
    }
};

module.exports = {
    obterLivros,
    incluir,
    excluir
};
