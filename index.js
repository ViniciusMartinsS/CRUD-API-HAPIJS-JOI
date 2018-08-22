/* 
O nodejs é bem popular para trabalhar com APIs
A diferença para uma aplicação JAVA contra uma Aplicação JavaScript
Quando um Java recebe uma requisição, ele levanta uma thread, o limite de processamento, limite de usuario é relativo a quantidade de recursos da máquina
Se eu quiser 10000 de usuario === Maquina Parrudona 
Quando o nodejs recebe uma requisicao ele delega ao SO que enfilera essas requisições. Quanto mais users maior a fila. 
*/

//Para subir um servidor do zero, sem framework 
/* const http = require('http');
http.createServer((req, res) => {
    res.end('Hello World');
})

//Inicializamos nosso servidor
.listen(3000, () => {
    console.log('Servidor Rodando');
})
*/

//importamos nossa classe de banco de dados:
//Se nao colocar o ./ ele vai caçar na node_modules, quando esta no mesmo nível usar ./
const database = require('./database');

//Para trabalhar com app profissionais, instalaremos o Hapi.js na versão 16
// npm install --save hapi@16
//importamos o hapijs
const Hapi = require('hapi');
const server = new Hapi.Server();
//Setamos a porta para expor nossa api
server.connection({ port: 3000 })

//Para validar a requisição, sem precisar ficar fazendo vários if
//Instalamos o Joi - npm i --save joi
const Joi = require('joi');

; (async () => {
    server.route([
        // Criamos a Rota de listar herois 
        {
            //Definir a URL
            path: '/heroes',
            method: 'GET',
            //Quando o user chamar o localhost:3000/heroes com o GET, essa função vai manipular sua resposta
            handler: async (request, reply) => {
                try {
                    const dados = await database.listar();
                    return reply(dados);
                } catch (error) {
                    console.error('Deu Ruim', error);
                    return reply();
                }
            }
        },
        {
            path: '/heroes',
            method: 'POST',
            handler: async (request, reply) => {
                try {
                    const { payload } = request
                    const item = {
                        ...payload,
                        id: Date.now()
                    }
                    const result = await database.cadastrar(item);
                    return reply('Cadastrado com sucesso!');
                } catch (error) {
                    console.error('Deu Ruim', error);
                    return reply('Osso, deu ruim');
                }

            },
            config: {
                //Para validar a requisição 
                validate: {
                    //Podemos validar todos os tipo de requisições 
                    // Payload -> Se é o body da requisição
                    // Params -> Url da requisição products/:id
                    // Query -> URL products?nome=Erick&Idade=13
                    // Headers -> Geralmente usado para validar tokens
                    payload: {
                        nome: Joi.string().max(10).min(2).required(),
                        poder: Joi.string().max(5).min(3).required(),
                        dtnascimento: Joi.date().required(),
                        namorada: Joi.string()
                    }
                }
            }
        },
        {
            path: '/heroes/{id}',
            method: 'DELETE',
            config: {
                validate: {
                    params: {
                        id: Joi.number().required()
                    }
                }
            },
            handler: async (request, reply) => {
                const { id } = request.params;
                const result = await database.remove(id);
                return reply('Removido com sucesso');
            }
        }
    ])

    //Inicializamos nossa api
    // 1º Passo
    await server.start()
    console.log('Server Running 3000');
})()

    /*
    O Hapijs trabalha seguindo a especificação RestFull
    Dependendo do código http, ele retorna um status diferente 
    e identifica quem será chamado de acordo com o método
    Create > POST - /products -> dados no body da requisição 
    Read > GET - /products -> listar informações 
    Read > GET - /products/:id -> Obter um recurso pelo id 
    Read > GET - /products/:id/colors -> Obtém todas as cores de um produto específico
    Update > PUT /products/:id + dados completos no body da requisição - Atualizar o objeto completo
    Update > PATCH /products/:id + dados parciais, nome, cpf, ou opcionais - Atualizar o objeto parcial
    Delete > /products/i:d - Remove um produto específico

    Proxy - quando faço uma ponte entre duas apis, ou seja, requisito uma api pra mostrar na minha.
    */