const express = require("express")
const bodyParser = require("body-parser")
const apiController = require('./src/api/ApiController')
require("dotenv-safe").config();

const jwt = require('jsonwebtoken');

const swaggerUi = require('swagger-ui-express');
const swagger = require('./swagger.json');


const app = express()

// body-parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json({}))

app.use('/api', verifyJWT, apiController)

app.post('/login', (req, res, next) => {
    //esse teste abaixo deve ser feito no seu banco de dados
    if(req.body.user === 'luiz' && req.body.password === '123'){
      //auth ok
      const id = 1; //esse id viria do banco de dados
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 3000 // expires in 5min
      });
      return res.json({ auth: true, token: token });
    }
    
    res.status(500).json({message: 'Login inválido!'});
})

app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})

app.listen('8080', () => {
    console.log('O servidor esta rodando na porta 8080');
})



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));
//  BotCrawler.init()

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}