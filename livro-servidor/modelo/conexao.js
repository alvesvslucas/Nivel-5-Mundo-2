const banco = require('mongoose');

//nome do banco de dados
const dbName = 'livraria';

//endereço do banco de dados + banco de dados
const mongoURI = `mongodb://127.0.0.1:27017/${dbName}`


banco.connect(mongoURI) //chamando o link do banco de dados
    .then(() => console.log('Servidor ligado e Conectado ao MongoDB com SUCESSO! ^_^'))
    .catch(err => console.error(err, 'Ixi deu problema na conexão. O motivo está na mensagem acima! (┬┬__┬┬)' ));

banco.Promise = global.Promise;
module.exports = banco;
