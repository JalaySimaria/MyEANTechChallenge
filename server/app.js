// import module from npm
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const logger = require('morgan');

// import user modules
const models = require('./models');

//Env configuration
const ENV = require('./config/constants')['ENVIRONMENT'];
const config = require(`./config/config-${ENV}.json`);

// route files 
const home = require('./routes/home');

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
	limit: '50mb'
}));
app.use(express.static(path.join(__dirname + '/public')));
app.use(logger('dev'));

// route name
app.use('/', home);

models.sequelize.sync().then(() => {
	app.listen(config.SERVER.WEB.SERVER_PORT, config.SERVER.WEB.SERVER_HOST_IP, (err) => {
		console.log((err) ? 'Server connection failed \n ' + err : 'Server listening on port : ' + config.SERVER.WEB.SERVER_PORT);
	});
}).catch((error) => {
	console.log('MySQL Connectino error : ', error);
});

module.exports = app;