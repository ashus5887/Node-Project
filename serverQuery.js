var http = require("http")
var fs = require("fs")
var url = require("url")
var overviewfn = require("./overview")
var overview = overviewfn();

var cardfn = require("./cardTemplate")
var card = cardfn();

var nonOrgCardfn = require("./cardTemplateNonOrganic")// Not Requiered
var nonOrgCard = nonOrgCardfn();

var data = fs.readFileSync("data.json")//data in buffer form
var json = JSON.parse(data);//object form
// console.log(json)
// var json = JSON.parse(data)// emoji compromised
var productPage = fs.readFileSync("./product.html")//Buffer
var oldpp = productPage + " ";
// console.log(productPage)

var server = http.createServer(function (req, res) {

    if (req.url == "/" || req.url == "/overview") {
        
        var mypage = overview;
        var myCard = "";
        for(var i in json)
        {

            var newCard = card.replace(/{productName}/g, json[i].productName)
            
            if(json[i].organic == false)
            {
                newCard = newCard.replace(/{NOT_ORGANIC}/g, "not-organic")
            }
            newCard = newCard.replace(/{quantity}/g, json[i].quantity)
            newCard = newCard.replace(/{price}/g, json[i].price)
            newCard = newCard.replace(/{image}/g, json[i].image)
            myCard = myCard + newCard;
        }
         
        mypage = mypage.replace("{%start%}", myCard);
        res.write(mypage);
    }
    else if (req.url == "/api") {
        res.write("API");
    }
    else if (req.url.substring(0, 8) == "/product") {
        // console.log(url.parse(req.url));
        var parsedUrlQuery = url.parse(req.url, true).query['id'];//parse->object parsing
        // console.log(parsedUrlQuery);
        var pp = oldpp;
        // console.log(pp)
        pp = pp.replace(/{%productName%}/g, json[parsedUrlQuery].productName)
        pp = pp.replace(/{%from%}/g, json[parsedUrlQuery].from)
        pp = pp.replace(/{%nutrients%}/g, json[parsedUrlQuery].nutrients)
        pp = pp.replace(/{%quantity%}/g, json[parsedUrlQuery].quantity)
        pp = pp.replace(/{%price%}/g, json[parsedUrlQuery].price)
        pp = pp.replace(/{%description%}/g, json[parsedUrlQuery].description)
        // console.log(json[parsedUrlQuery].image);
        pp = pp.replace(/{%image%}/g, json[parsedUrlQuery].image)
        
        res.write(pp);
        // pp = oldpp;
    }
    else {
        res.write("Page Not Found");
    }
    res.end();
})
var port = process.env.PORT || 3000;//Done for Heroku
server.listen(port, function () {
    console.log("Server is listening at port 3000 :)");
})

/*
npm init
npm install nodemon --save-dev
scripts start : nodemon filename.js
npm start instead of node filename.js
*/