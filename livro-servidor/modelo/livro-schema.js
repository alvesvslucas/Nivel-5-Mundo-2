const banco = require('./conexao');

const LivroSchema = new banco.Schema({
    id: { type: banco.Schema.Types.ObjectId },
    titulo: { type: String },
    codEditora: { type: Number },
    resumo: { type: String },
    autores: { type:[String] }
});

const Livro = banco.model('livros', LivroSchema);

module.exports = Livro;
