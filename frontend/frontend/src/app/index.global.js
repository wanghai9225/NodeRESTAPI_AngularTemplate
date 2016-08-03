(function ()
{
    'use strict';

    angular
        .module('fuse')
        .factory('GlobalVariable', globalVariable);
        
    function globalVariable(){
    	return {
    		serverUrl: 'http://localhost:9000/'
    	};
    }
})();
