(function ()
{
	'use strict';

	angular
		.module('app.reports', [])
		.config(config);

	/** @ngInject */
	function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
	{
		// State
		$stateProvider.state('app.reports', {
			url      : '/reports',
			views    : {
				'content@app': {
					templateUrl: 'app/main/apps/reports/reports.html',
					controller : 'ReportsController as vm'
				}
			},
			bodyClass: 'reports'
		});

		// Translation
		$translatePartialLoaderProvider.addPart('app/main/apps/reports');

		// Api
		// 

		msApiProvider.register('reports.create.category', ['http://localhost:9000/api/report_category/create', {}, {
			create: {
				method: "POST",
				transformRequest: angular.identity,
				headers: { 'Content-Type': undefined }
			}
		}]);

		msApiProvider.register('reports.create.report', ['http://localhost:9000/api/reports/create', {}, {
			create: {
				method: "POST",
				transformRequest: angular.identity,
				headers: { 'Content-Type': undefined }
			}
		}]);

		msApiProvider.register('reports.get.categories', ['http://localhost:9000/api/report_category/:type/:id', {}, {
			get: {method: 'GET', isArray: true}
		}]);

		msApiProvider.register('reports.get.files', ['http://localhost:9000/api/reports/:id', {}, {
			get: {method: 'GET', isArray: true}
		}]);

		msApiProvider.register('reports.category.get.files', ['http://localhost:9000/api/documents/category/:id', {}, {
			get: {method: 'GET', isArray: true}
		}]);

		msApiProvider.register('reports.category.get.categories', ['http://localhost:9000/api/doc_category/category/:id', {}, {
			get: {method: 'GET', isArray: true}
		}]);

		// Navigation
		msNavigationServiceProvider.saveItem('reports', {
			title : 'Reports',
			icon  : 'icon-calendar-today',
			state : 'app.reports',
			weight: 1
		});
	}

})();