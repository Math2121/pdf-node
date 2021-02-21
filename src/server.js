const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const puppeteer = require('puppeteer')

const passengers = [
    {
        name: "Joyce",
        flightNumber: 7859,
        time: "18h00",
    },
    {
        name: "Brock",
        flightNumber: 7859,
        time: "18h00",
    },
    {
        name: "Eve",
        flightNumber: 7859,
        time: "18h00",
    },
]

app.get('/pdf', async (req,res)=>{

    //Abro um navegador
    const browser  = await puppeteer.launch()

    const page = await browser.newPage()

    //Assim que aberto o navegador ele vai para rota main da aplicação
    await page.goto('http://localhost:4000',{
        waitUntil:'networkidle0'
    })
    //Pega o pdf da página main da aplicação
    const pdf = await page.pdf({
        printBackground:true,
        format:'Letter',
        margin:{
            top:'20px',
            bottom:'40px',
            left:'20px',
            right:'20px'
        }

    })
    //Navegador fecha
    await browser.close()

    
    //Envio o tipo de aplicação que será enviada
    res.contentType('application/pdf')
    return res.send(pdf)
})

app.get("/", (req, res) => {

    //Busca o caminho do html
    const pathFile = path.join(__dirname, "/print.ejs")

    //Renderiza o arquivo e envia o array
    ejs.renderFile(pathFile, {passengers}, (err, html) => {
        if (err) {
            return res.send('Erro na leitura')
        }
        //Envia para o navegador
        return res.send(html)
    })
})

app.listen(4000, () => {
    console.log("Server rodando")
})
