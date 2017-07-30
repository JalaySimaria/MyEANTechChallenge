const ENV = require('../config/constants')['ENVIRONMENT'];
const config = require(`../config/config-${ENV}.json`);
const CONSTANTS = config.CONSTANTS;
const VIEWS = config['VIEWS'];
const MIDDLEWARE = require('../middleware');
const express = require('express');
const route = express.Router();
const path = require('path');
const root_path = path.dirname(require.main.filename);
const models = require('../models');
const uuid = require('uuid');
const upload = require('multer')();

/*
	Rendering home page
 */
route.get('/', (req, res) => {
	res.sendFile(path.join(root_path + VIEWS.VIEW_HOME));
});

/*
	Image upload API
	Type : POST
	Params : {
		image : base64 converted image,
		image_JSON : stringified fabric canvas to JSON,
		image_id : (optional) needed to update old design,
		history_id : (optionsl) needed to update a specific history design
	}
	Success Response : {
		status : 200,
		message : 'Image uploaded.',
		data : {
			image_id : dynamically generated unique design ID
		}
	}
	Failure Response : {
		status : 400,
		message : 'Something went wrong. Please try again later.'
	}
 */
route.post('/uploadImage', upload.array(), MIDDLEWARE.clear_latest, (req, res) => {
	let timestamp = new Date();

	if (req.body.history_id) {
		models.Image_Upload.findOne({
			where : {
				id : req.body.history_id
			}
		}).then((history) => {
			history.update({
				image : req.body.image,
				image_JSON : req.body.image_JSON,
				timestamp : timestamp,
				is_latest : true
			}).then((imageUpdated) => {
				if (imageUpdated) {
					res.send({
						status : 200,
						message : 'Image uploaded.',
						data : {
							image_id : history.image_id
						}
					});
				} else {
					res.send({
						status : 400,
						message : 'Something went wrong. Please try again later.'
					});
				}
			});
		});
	} else {
		let image_id = req.body.image_id ? req.body.image_id : uuid.v4();
			
		models.Image_Upload.create({
			image_id : image_id,
			image : req.body.image,
			image_JSON : req.body.image_JSON,
			timestamp : timestamp,
			is_latest : true
		}).then((image_store) => {
			if (image_store) {
				res.send({
					status : 200,
					message : 'Image uploaded.',
					data : {
						image_id : image_id
					}
				});
			} else {
				res.send({
					status : 400,
					message : 'Something went wrong. Please try again later.'
				});
			}
		});
	}
});

/*
	Get Designs API
	Type : GET
	Success Response : {
		status : 200,
		message : 'Operation successful.',
		designs : [
			{
				image_id : dynamically generated unique design ID,
				image : base64 converted image,
				image_JSON : stringified fabric canvas to JSON,
				timestamp : timestamp for history purpose 
			},
			...
		]
	}
	Failure Response : {
		status : 400,
		message : 'Something went wrong. Please try again later.'
	}
 */
route.get('/getDesigns', (req, res) => {
	models.Image_Upload.findAll({
		where : {
			is_latest : true
		},
		attributes : ['image_id', 'image', 'image_JSON', 'timestamp'],
		raw : true
	}).then((images) => {
		if (images) {
			res.send({
				status : 200,
				message : 'Operation successful.',
				designs : images
			});
		} else {
			res.send({
				status : 400,
				message : 'Something went wrong. Please try again later.'
			});
		}
	});
});

/*
	Get History Designs API
	Type : POST
	Params : {
		image_id : dynamically generated unique design ID
	}
	Success Response : {
		status : 200,
		message : 'Operation successful.',
		designs : [
			{
				id : auto incremented unique image id,
				image : base64 converted image,
				image_JSON : stringified fabric canvas to JSON,
				timestamp : timestamp for history purpose 
			},
			...
		]
	}
	Failure Response : {
		status : 400,
		message : 'Something went wrong. Please try again later.'
	}
 */
route.post('/getHistory', (req, res) => {
	models.Image_Upload.findAll({
		where : {
			image_id : req.body.image_id
		},
		attributes : ['id', 'image', 'image_JSON', 'timestamp'],
		raw : true
	}).then((images) => {
		if (images) {
			res.send({
				status : 200,
				message : 'Operation successful.',
				designs : images
			});
		} else {
			res.send({
				status : 400,
				message : 'Something went wrong. Please try again later.'
			});
		}
	});
});

module.exports = route;