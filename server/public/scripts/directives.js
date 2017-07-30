angular.module('app.directives', [])

.directive('fileOnChange', ['$rootScope',
	function($rootScope) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('change', function(event) {
					var file = event.target.files[0];
					var reader = new FileReader();

					reader.onload = function (f) {
						var data = f.target.result;
						fabric.Image.fromURL(data, function (img) {
							var oImg = img.set({left: 0, top: 0, angle: 0,width:100, height:100}).scale(0.9);
							$rootScope.canvas.add(oImg).renderAll();
							var a = $rootScope.canvas.setActiveObject(oImg);
							var dataURL = $rootScope.canvas.toDataURL({format: 'png', quality: 0.8});
						});
						scope.home.models.disableActions = false;
						scope.$apply();
					};
					reader.readAsDataURL(file);
				});

				element.bind('click', function() {
					element.val('');
				});
			}
		};
	}
])

.directive('loadInCanvas', ['$rootScope',
	function($rootScope) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var canvasJSON = scope.$eval(attrs.loadInCanvas);

				element.bind('click', function(event) {
					$rootScope.canvas.clear();
					$rootScope.canvas.loadFromJSON(JSON.parse(canvasJSON), function() {
						$rootScope.canvas.renderAll();
					});
				});
			}
		};
	}
])

.directive('addText', ['$rootScope',
	function($rootScope) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('click', function(event) {
					$rootScope.canvas.add(new fabric.IText('Double Tap and Type'));
					scope.home.models.disableActions = false;
					scope.$apply();
				});
			}
		};
	}
])

.directive('removeElement', ['$rootScope',
	function($rootScope) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('click', function(event) {
					if ($rootScope.canvas.getActiveGroup()) {
						$rootScope.canvas.getActiveGroup().forEachObject(function(elem) {
							$rootScope.canvas.remove(elem);
						});
						$rootScope.canvas.discardActiveGroup().renderAll();
					} else {
						$rootScope.canvas.remove($rootScope.canvas.getActiveObject());
					}
				});
			}
		};
	}
])

.directive('clearCanvas', ['$rootScope',
	function($rootScope) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('click', function(event) {
					$rootScope.canvas.clear();
				});
			}
		};
	}
]);