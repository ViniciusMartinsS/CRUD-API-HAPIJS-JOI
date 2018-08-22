const { readFile, writeFile } = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

class Database {
    constructor() {
        this.NOME_ARQUIVO = 'heroes.json';
    }

    async obterDados() {
        const dados = await readFileAsync(this.NOME_ARQUIVO);
        return JSON.parse(dados);
    }

    async atualizarArquivo(dados) {
        return writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados));
    }

    async cadastrar(item) {
        const dados = await this.obterDados();
        dados.push(item);
        return this.atualizarArquivo(dados);
    }

    listar() {
        return this.obterDados();
    }

    async remove(id) {
        const dados = await this.obterDados();
        //Iteramos em cima da lista procurando todo mundo que nao tenha aquele id
        // o != com para somente o valor, !== valor e tipo
        const dadosFiltrados = dados.filter(item => item.id !== id)
        return this.atualizarArquivo(dadosFiltrados);
    }
}

module.exports = new Database();