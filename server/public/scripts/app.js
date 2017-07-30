angular.module('myApp', ['app.controllers', 'app.routes', 'app.directives', 'app.services'])

.run(function($rootScope, CommonFactory) {
	CommonFactory.useEnvironment("LOCAL"); // LOCAL or DEV or BETA or PROD 

	$rootScope.canvas = new fabric.Canvas('canvas');
});

var app_controllers = angular.module('app.controllers', []);