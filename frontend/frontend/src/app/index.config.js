(function ()
{
	'use strict';

	angular
		.module('fuse')
		.config(config);

	/** @ngInject */
	//config.$inject = ['$httpProvider'];
	function config($httpProvider, msApiProvider) {
		//console.log("config");
		$httpProvider.defaults.useXDomain = true;
		//delete $httpProvider.defaults.headers.common['X-Requested-With'];
		//console.log($httpProvider.defaults);

		msApiProvider.register('Portals', ['http://localhost:9000/api/portal', {}, {
		  get: {method: 'get', isArray: true}
		}]);

		msApiProvider.register('Properties', ['http://localhost:9000/api/property/:id', {}, {
		  get: {method: 'get', isArray: true}
		}]);


	}


})();