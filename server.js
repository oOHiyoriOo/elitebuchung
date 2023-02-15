// Import Modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');


// Load config file.
const cfg = require('./config.json');

// Create the Webserver
const app = express();
	// extras i need.
	app.use(express.static('assets'))
	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }))
	// parse application/json
	app.use(bodyParser.json())
	// Cookie handling

	// header manipulation
	app.use(function (req, res, next) {
		res.setHeader("X-Powered-By","Variant ist doof.")
		next();
	});


// Routes
app.get('/', (req, res) => {
	res.send( fs.readFileSync(process.cwd()+"/html/index.html",{encoding:'utf-8'}) );
});

app.post('/book', (req,res) => {
    let data = req.body;
    if( ["day","hour","teacher","fach"].every(key => data[key] !== '') ){

        let db = JSON.parse( fs.readFileSync(process.cwd()+"/data/bookings.json",{encoding:'utf-8'}) );

        db.push(data)

        fs.writeFileSync(process.cwd()+"/data/bookings.json",JSON.stringify(db),{encoding:'utf-8'})
        res.status(200).send({'msg':'data saved!'})
    }else{
        res.status(500).send({"msg":"missing or invalid data."})
    }
});

app.get('/book', (req,res) => {
    res.send( fs.readFileSync(process.cwd()+"/data/bookings.json",{encoding:'utf-8'}) )
});



// Hallo Motherfucker

app.listen(cfg.port,cfg.host, () => {
    console.log(`App listening at http://${cfg.host}:${cfg.port}`);
});