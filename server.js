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
	res.setHeader("X-Powered-By", "Elite")
	next();
});


// Set the views directory and view engine to EJS
app.set('views', './html');
app.set('view engine', 'ejs');


app.get('/', (req, res) => { res.redirect('/index.html') })



app.get('/index.html', (req, res) => {
	let bookings = fs.readFileSync(process.cwd() + "/data/bookings.json", { encoding: 'utf-8' });

	res.render('index.ejs', { bookings });
});


// Catch .php requests and render .ejs files with the same filename if they exist
app.get('*.html', (req, res, next) => {
	const ejsPath = path.join(__dirname, 'html', `${(req.path).slice(0, -4)}ejs`);

	console.log(ejsPath)

	// Check if the corresponding .ejs file exists
	fs.access(ejsPath, fs.constants.F_OK, (err) => {
		if (err) {
			// If the .ejs file doesn't exist, move on to the next middleware
			return next();
		}

		// If the .ejs file exists, render it
		res.render(ejsPath);
	});
});




app.post('/book', (req, res) => {
	let data = req.body;
	if (["day", "hour", "teacher", "fach","room"].every(key => data[key] !== '')) {

		let db = JSON.parse(fs.readFileSync(process.cwd() + "/data/bookings.json", { encoding: 'utf-8' }));

		db.push(data)

		fs.writeFileSync(process.cwd() + "/data/bookings.json", JSON.stringify(db), { encoding: 'utf-8' })
		res.status(200).send({ 'msg': 'data saved!' })
	} else {
		res.status(500).send({ "msg": "missing or invalid data." })
	}
});

app.get('/book', (req, res) => {
	res.send(fs.readFileSync(process.cwd() + "/data/bookings.json", { encoding: 'utf-8' }))
});

// reset the bookings by rewriting the file. 
app.post('/82851faa-e000-4d43-9ac7-44b17a1d15b2', (req, res) => {
	console.log("Database Reset Started!")
	fs.writeFileSync(process.cwd() + "/data/bookings.json", JSON.stringify([]), { encoding: 'utf-8' })
	res.send({'msg':'okay'})
})

app.listen(cfg.port, cfg.host, () => {
	console.log(`App listening at http://${cfg.host}:${cfg.port}`);
});