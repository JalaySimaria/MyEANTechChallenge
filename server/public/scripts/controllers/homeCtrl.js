var homeCtrl = function($rootScope, CommonFactory, CommonService) {
	var _this = this;
	var history_id = '';

	_this.models = {
		designs : [],
		history : [],
		image_id : ''
	};

	function isCanvasBlank(canvas) {
		var blank = document.createElement('canvas');
		blank.width = canvas.width;
		blank.height = canvas.height;

		return $rootScope.canvas.toDataURL() == blank.toDataURL();
	}

	_this.getDesigns = function() {
		CommonFactory.makeRequest('GET', 'getDesigns', {}, function(response) {
			_this.models.designs = response.designs;
		}, CommonFactory.commonSuccess);
	};

	_this.getDesigns();

	_this.loadDesign = function(design) {
		_this.models.image_id = design.image_id;
		history_id = '';
		CommonFactory.makeRequest('POST', 'getHistory', {
			image_id : design.image_id
		}, function(response) {
			_this.models.history = response.designs;
		}, CommonFactory.commonSuccess);
	};

	_this.selectHistory = function(history) {
		history_id = history.id;
	};

	_this.addNew = function() {
		_this.models.history = [];
		_this.models.image_id = '';
		history_id = '';
	};

	_this.saveDesign = function() {
		var base64Data = $rootScope.canvas.toDataURL('png').replace(/^data:image\/png;base64,/, "");
		CommonFactory.makeRequest('POST', 'uploadImage', {
			image_id : _this.models.image_id,
			history_id : history_id,
			image : base64Data,
			image_JSON : JSON.stringify($rootScope.canvas)
		}, function(response) {
			_this.models.image_id = response.data.image_id;
			_this.getDesigns();
			_this.loadDesign(response.data);
		}, CommonFactory.commonSuccess);
	};
};

homeCtrl.$inject = ['$rootScope', 'CommonFactory', 'CommonService'];

app_controllers.controller('homeCtrl', homeCtrl);