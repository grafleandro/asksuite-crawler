const express = require('express')
const validator = require('../logic/Validator')
const BotCrawler = require('../crawler/BotCrawler')
const router = express.Router()

router.post('/buscar', async (req, res) =>  {
   
    let val = []
    let validate = true
    let error

    // verificando se esta sendo enviado o checkin e checkout
    if(req.body.checkin && req.body.checkout){
        val.push(req.body.checkin)
        val.push(req.body.checkout)
    }else{
        error = {success:0, error: "É necessario informar a data de Checkin e Checkout"}
        validate = false
    }
    
    // validando as datas que foram enviadas
    val.map((date) => {

        result = validator.date(date)
        
        if(result.success==0 && validate){
            error = result
            validate = false
        }
    })

    if(validate){
        // chamada do botcrawler
    
        let response = await BotCrawler.init(req.body)

        BotCrawler.close()

        // #swagger.responses[200] = { description: "Sucesso na consulta." }
        res.status(200).json(response)
    }else{
        // #swagger.responses[400] = { description: "Server failure."}
        res.status(400).json(error)
    } 
   
    
})

module.exports = router