const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	let Image_Upload = sequelize.define("Image_Upload", {
		image_id : {
			type : DataTypes.TEXT
		},
		image : {
			type : DataTypes.TEXT
		},
		image_JSON : {
			type : DataTypes.TEXT
		},
		timestamp : {
			type : DataTypes.DATE
		},
		is_latest : {
			type : DataTypes.BOOLEAN
		}
	}, {
		timestamps : false,
		classMethods : {}
	});
	return Image_Upload;
};