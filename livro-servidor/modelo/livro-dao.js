const Livro = require('./livro-schema');

// Let the HTTP layer report database failures instead of returning false success.
const obterLivros = () => Livro.find();
const incluir = (livro) => Livro.create(livro);
const excluir = (codigo) => Livro.deleteOne({ _id: codigo });

module.exports = { obterLivros, incluir, excluir };
