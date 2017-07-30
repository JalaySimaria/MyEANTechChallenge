const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const ENV = require('../config/constants')['ENVIRONMENT'];
const config = require(`../config/config-${ENV}.json`)['SERVER']['DB'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = {};

fs
.readdirSync(__dirname)
.filter((file) => {
	return (file.indexOf(".") !== 0) && (file !== "index.js"); 
})
.forEach((file) => {
	let model = sequelize.import(path.join(__dirname, file));
	db[model.name] = model;
});

sequelize
.authenticate()
.then(() => {
	sequelize.query("ALTER TABLE `image_upload` CHANGE `image` `image` LONGTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, CHANGE `image_JSON` `image_JSON` LONGTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL").spread((results, metadata) => {
		console.log('Connection has been established successfully.');
	});
})
.catch(err => {
	console.error('Unable to connect to the database:', err);
});

Object.keys(db).forEach((modelName) => {
	if ("associate" in db[modelName]) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;