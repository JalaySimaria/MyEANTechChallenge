angular.module('app.services', [])

.factory('CommonFactory', ['$rootScope', '$http', 'CommonService', 
	function($rootScope, $http, CommonService){
		return {
			useEnvironment : function(env) {
				/*if (env === "LIVE") CommonService.baseAPIURL = "https://www.jalay.in/";
				else if (env === "BETA") CommonService.baseAPIURL = "http://beta.jalay.in/";
				else if (env === "DEV") CommonService.baseAPIURL = "http://dev.jalay.in/";
				else if (env === "LOCAL") CommonService.baseAPIURL = "http://localhost:3003/";*/
				CommonService.baseAPIURL = "http://localhost:3003/";
			},
			makeRequest : function(reqMethod, reqUrl, jsonData, successCallback, errorCallback) {
				NProgress.start();

				var http_obj = {
					method: reqMethod,
					url: CommonService.baseAPIURL + reqUrl,
					data: jsonData
				};

				$http(http_obj).then(function(response) {
					NProgress.done();
					successCallback(response.data);
				}, function(response) {
					NProgress.done();
					errorCallback(response.data);
				});
			},
			errorCallback : function(response) {
				CommonService.alertBox('Status', CommonService.requestTimeout ? "Request timeout." : response.message);
			},
			commonSuccess : function(response) {
				if (response.status === 200) CommonService.alertBox("Success", response.message);
				else CommonFactory.errorCallback(response);
			}
		};
	}
])

.service('CommonService', [ 
	function() {
		this.baseAPIURL = "";

		this.alertBox = function(header, content, onOkClick) {
			// custom alert box
		};

		this.requestTimeout = false;

		var sharableData = {};

		this.setSharable = function(key, value) {
			sharableData[key] = value;
		};

		this.getSharable = function(key) {
			return sharableData[key];
		};

		this.hasSharable = function(key) {
			return sharableData.hasOwnProperty(key);
		};
	}
]);