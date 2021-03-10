## Teste NodeJS e Crawler AskSuite 

O teste consiste em realizar uma API que vai realizar  crawler no site https://lecanton.com.br/ com o intuito de localizar hoteis disponiveis na data informada para a API, sendo que a API deve retorna os seguintes dados no formato JSON:

- Nome
- Descrição
- Preço
- Imagem


## Tecnologias Utilizadas

- JWT - [Artigo] https://www.luiztools.com.br/post/autenticacao-json-web-token-jwt-em-nodejs/

- Puppeteer - https://devdocs.io/puppeteer/

- Swagger - https://swagger.io/

## Instalação e execução 

Para a instalação das dependencias deve ser executado o seguinte comando:

- <i> npm i </i> ou <i>npm install</i>

Antes de executar o comando para a execução deve-se realizar a copia do arquivo .env.example para .env.
Para a execução do projeto deve ser executado o comando:


- <i> npm run dev </i> 

## Observações

A URL de login foi emulada diretamente no codigo, haja vista que não foi utilizado bando de dados. O motivo para não usar o banco de foi que API criada seria consumida por outra API podendo essa armazenar os dados fornecidos.

## Passo a passo dos Testes
    Os testes foram realizados no aplicativo Postman com as seguintes configurações.
        
    - Login -
    url: localhost:3000/login
    Na aba Body do postman deve possui as seguinte Key e Values
    user = leandro
    password = 123

    payload de retorno do login
    {
        "auth": true || false
        "token": token_string || null
    }

    - Busca -
    url: localhost:3000/api/buscar
    ----------------------------------------
    Na aba headers do postman deve ser inserido a seguinte key x-access-token que deve receber o token recebido na rota login.
    x-access-token = token_string
    ----------------------------------------
    Na aba Body do postman deve possui as seguinte configurações.
    Estar selecionado a opção RAW e o tipo deve ser JSON, sendo assim o campo pode ser preechido conforme exemplo abaixo.

    {
    "checkin":"14/03/2021",
    "checkout": "18/03/2021"
    }

    O retorno da busca leva aproximadamente de 20 a 30 dependendo da latencia da rede e do numero de hoteis e quartos disponiveis para o periodo

    payload de retorno da busca
    {
        "success": 1, 
        "results": [
            {
                "name": "nome",
                "description": "descrição",
                "prices": {
                    "nonRefundable": "preço com Tarifa não reembolsável",
                    "promotionalCode": "preço CODIGO PROMOCIONAL",
                    "flexibleTariff": "preço com Tarifa Flexível"
                },
                "imageUrl": "url",
                "imageBase64": null
            },
        ]
    }


## Agradecimento

Agradeço a empresa pela oportunidade para demostrar minhas skills, aumentar meus conhecimentos por meio desse desafio, bem como conhecer novos profissonais como o Felippe e Mateus.


## Licença

[MIT license](https://opensource.org/licenses/MIT).
