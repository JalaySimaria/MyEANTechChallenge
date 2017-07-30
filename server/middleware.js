const models = require('./models');
const async = require('async');

module.exports = {
	clear_latest(req, res, next) {
		if (req.body.image_id) {
			models.Image_Upload.findAll({
				where : {
					image_id : req.body.image_id,
					is_latest : true
				}
			}).then((images) => {
				if (images.length) {
					async.each(images, (image, callback) => {
						image.update({
							is_latest : false
						}).then((imageUpdated) => {
							callback(null);
						});
					}, () => {
						next();
					});
				} else next();
			});
		} else next();
	}
};