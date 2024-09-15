const express = require('express');
const router = express.Router();
const { obterLivros, incluir, excluir } = require('../modelo/livro-dao');

// Rota para obter todos os livros
router.get('/', async (req, res) => {
    try {
        const livros = await obterLivros();
        res.json(livros);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rota para incluir um novo livro
router.post('/', async (req, res) => {
    try {
        const novoLivro = await incluir(req.body);
        res.status(201).json(novoLivro);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Rota para excluir um livro
router.delete('/:id', async (req, res) => {
    try {
        await excluir(req.params.id);
        res.json({ message: 'Livro excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
