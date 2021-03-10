const axios = require('axios')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer');
const convert = require('../logic/convert')

class BotCrawler {

    constructor() {
        this.URL_SEARCH = 'https://lecanton.com.br/'
        this.URL_VIEW_HOTEL = ''
        this.browser = null
        this.pageResult = null
        this.checkin = null
        this.checkout = null
    }

    async init(dates) {

        let page

        this.browser = await puppeteer.launch({
            headless: true,
        });

        page = await this.browser.newPage();

        await this.start(page, dates)
    

        // funçao pega o id dos hoteis que estão disponiveis para o periodo
        let results = await this.getIdHotels()
        
        //caso não encontre é retornado que não foi encontrado hotel disponivel 
        if(results.length == 0){
            return  {success: 0 , results:'Para esse periodo não foi encontrado hotel disponivel'}
        }

        let dataResponse = {success: 1, results: await this.crawlerData(results)}

        return dataResponse

    }

    async crawlerData(results){
        let loop = 0

        let response

        do{
            this.URL_VIEW_HOTEL = `https://book.omnibees.com/hotelresults?c=2983&lang=pt-PT&CheckIn=${this.checkin}&CheckOut=${this.checkout}&NRooms=1&ad=2&ch=0&ag=&Code=&q=${results[loop].id}#show-more-hotel-button`

            await this.pageResult.goto(this.URL_VIEW_HOTEL)

            await this.pageResult.waitForSelector('.custom-hotel-name')

            response = await this.pageResult.$$eval('.roomrate', async itens => {
                let dateHotels = []
            
                itens.map(item => {                   

                    if(item.className.search('d-none') == -1){
                        
                        dateHotels.push({
                            name: item.getElementsByClassName('custom-hotel-name')[0].innerText,
                            description: item.getElementsByClassName('hotel-description')[0].innerText,
                            prices: {
                                nonRefundable: item.getElementsByClassName('price-after')[0].innerText,
                                promotionalCode: item.getElementsByClassName('price-total')[0].innerText,
                                flexibleTariff: item.getElementsByClassName('price-total')[1].innerText,
                            },
                            imageUrl: item.getElementsByClassName('image-step2')[0].getAttribute('src'),
                            imageBase64: null
                        })
                    }
                    
                })
                
                return dateHotels
            })

            loop++

        }while(loop < results.length)

        loop = 0

        do{
            let img64 = await convert.convert(response[loop].imageUrl)
            response[loop].imageBase64 = ('data:image/png;base64,' + img64.base64)
            loop++

        }while(loop < response.length)
        
        return response
    }

    async getIdHotels(){

        return this.pageResult.$$eval('.roomrate', itens => {
            let idHotels = []
        
            itens.map(item => {
                
                if(item.className.search('border-unset') == -1){
                    
                    idHotels.push({
                        id: item.dataset.hotelId,
                    })
                }
                
            })
                
            return idHotels
        })
    }

    async start(page,dates){

        let {checkin} = dates
        let {checkout} = dates

        checkin = checkin.replace('/','')
        checkin = checkin.replace('/','')

        checkout = checkout.replace('/','')
        checkout = checkout.replace('/','')
        
        this.checkin = checkin
        this.checkout = checkout
    
        await page.goto(this.URL_SEARCH)

        await page.waitForSelector('input[name=CheckIn]')
        await page.waitForSelector('input[name=CheckOut]')

        //setando o intervalo de datas recebido na API
        await page.$eval('input[name=CheckIn]', (el, checkin) => el.value = checkin, checkin)
        await page.$eval('input[name=CheckOut]', (el, checkout) => el.value = checkout, checkout)

        // salva o target da página original para comparar se foi ele que abriu a nova aba
        const pageTarget = page.target();

        page.click("#FormReserva > div.booknow > button")

        // verifica se a nova pagina foi aberta pela pagina original
        const newTarget = await this.browser.waitForTarget(target => target.opener() === pageTarget)

        // obtendo o oobjeto da nova page
        this.pageResult = await newTarget.page();

        await this.pageResult.waitForSelector('#hotels_grid').catch(err => {
            console.log(err)
        })
    }

    async close(){
        this.browser.close()
    }

}

module.exports = new BotCrawler