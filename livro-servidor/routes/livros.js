const express = require('express');
const router = express.Router();
const { obterLivros, incluir, excluir } = require('../modelo/livro-dao');

router.get('/', async (req, res) => {
    try {
        res.json(await obterLivros());
    } catch (err) {
        res.status(500).json({ ok: false, message: 'Não foi possível consultar os livros.' });
    }
});

router.post('/', async (req, res) => {
    const dados = req.body;
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)
        || typeof dados.titulo !== 'string' || !dados.titulo.trim()
        || typeof dados.resumo !== 'string' || !dados.resumo.trim()
        || !Number.isInteger(dados.codEditora) || dados.codEditora <= 0
        || !Array.isArray(dados.autores) || dados.autores.length === 0
        || !dados.autores.every(autor => typeof autor === 'string' && autor.trim())) {
        return res.status(400).json({ ok: false, message: 'Informe título, resumo, código de editora e autores válidos.' });
    }
    try {
        const livro = await incluir({
            titulo: dados.titulo.trim(),
            resumo: dados.resumo.trim(),
            codEditora: dados.codEditora,
            autores: dados.autores.map(autor => autor.trim())
        });
        res.status(201).json({ ok: true, livro });
    } catch (err) {
        res.status(500).json({ ok: false, message: 'Não foi possível cadastrar o livro.' });
    }
});

router.delete('/:id', async (req, res) => {
    if (!/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
        return res.status(400).json({ ok: false, message: 'Código de livro inválido.' });
    }
    try {
        const resultado = await excluir(req.params.id);
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ ok: false, message: 'Livro não encontrado.' });
        }
        res.json({ ok: true, message: 'Livro excluído com sucesso!' });
    } catch (err) {
        res.status(500).json({ ok: false, message: 'Não foi possível excluir o livro.' });
    }
});

module.exports = router;
