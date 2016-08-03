(function () {
	'use strict';

	angular
		.module('app.file-manager')
		.controller('FileManagerController', FileManagerController);

	/** @ngInject */
	function FileManagerController($mdDialog, $rootScope, msApi, apiAnswer) {
		
		var vm = this;

		// Data
		vm.selectedAccount = 'creapond';
		vm.currentView = 'list';
		vm.showDetails = true;

		vm.path = [{
			title: '/',
			id: '/'
		}];

		vm.folders = [];
		vm.files = [];

		$rootScope.$watch(function() {
			return $rootScope.currentPlace
		}, function () {

			if(!$rootScope.currentPlace) return;
			
			loadCategories()
			loadFiles()
			
		});


		// Methods

		vm.fileAdded = fileAdded;
		vm.upload = upload;
		vm.fileSuccess = fileSuccess;

		vm.select = select;
		vm.fileModal = fileModal;
		vm.openCategory = openCategory;
		vm.changePath = changePath;

		//////////

		function loadCategories() {

			msApi.request('fileManager.get.categories@get', {
				id: $rootScope.currentPlace.id,
				type: $rootScope.currentPlace.type
			}, function (res) {
				vm.folders = res;
				vm.selected = vm.folders[0];
			})

		}

		function loadFiles() {

			msApi.request('fileManager.get.files@get', {
				id: $rootScope.currentPlace.id,
				type: $rootScope.currentPlace.type
			}, function (res) {
				vm.files = res;
			})

		}


		function fileModal() {
		  $mdDialog.show({
				controller         : 'DocumentController',
				controllerAs       : 'vm',
				locals: {
					Categories: vm.folders,
					Files: vm.files,
					currentFolder: vm.currentFolder
				},
				templateUrl        : 'app/main/apps/file-manager/dialogs/document.html',
				clickOutsideToClose: true
			});
		}

		function openCategory(folder) {
			vm.path.push({
				id: folder._id,
				title: folder.name
			})

			vm.currentFolder = folder._id;

			loadOpenCategories(folder._id)
		}

		function changePath(id) {
			if(id === '/') {
				loadCategories()
				loadFiles()

				return vm.path.splice(1);
			}

			vm.path.forEach(function (elem, i) {

				if(elem.id === id) {
					vm.path = vm.path.splice(0, i + 1)
				}

			}) 

			loadOpenCategories(id)
		}

		/**
		 * File added callback
		 * Triggers when files added to the uploader
		 *
		 * @param file
		 */
		function fileAdded(file) {
			// Prepare the temp file data for file list
			var uploadingFile = {
				id       : file.uniqueIdentifier,
				file     : file,
				type     : '',
				owner    : 'Emily Bennett',
				size     : '',
				modified : moment().format('MMMM D, YYYY'),
				opened   : '',
				created  : moment().format('MMMM D, YYYY'),
				extention: '',
				location : 'Insurance Manuals > Medical',
				offline  : false,
				preview  : 'assets/images/etc/sample-file-preview.jpg'
			};

			// Append it to the file list
			vm.files.push(uploadingFile);
		}

		/**
		 * Upload
		 * Automatically triggers when files added to the uploader
		 */
		function upload() {
			// Set headers
			vm.ngFlow.flow.opts.headers = {
				'X-Requested-With': 'XMLHttpRequest',
				//'X-XSRF-TOKEN'    : $cookies.get('XSRF-TOKEN')
			};

			vm.ngFlow.flow.upload();
		}

		/**
		 * File upload success callback
		 * Triggers when single upload completed
		 *
		 * @param file
		 * @param message
		 */
		function fileSuccess(file, message) {
			// Iterate through the file list, find the one we
			// are added as a temp and replace its data
			// Normally you would parse the message and extract
			// the uploaded file data from it
			angular.forEach(vm.files, function (item, index)
			{
				if ( item.id && item.id === file.uniqueIdentifier )
				{
					// Normally you would update the file from
					// database but we are cheating here!

					// Update the file info
					item.name = file.file.name;
					item.type = 'document';

					// Figure out & upddate the size
					if ( file.file.size < 1024 )
					{
						item.size = parseFloat(file.file.size).toFixed(2) + ' B';
					}
					else if ( file.file.size >= 1024 && file.file.size < 1048576 )
					{
						item.size = parseFloat(file.file.size / 1024).toFixed(2) + ' Kb';
					}
					else if ( file.file.size >= 1048576 && file.file.size < 1073741824 )
					{
						item.size = parseFloat(file.file.size / (1024 * 1024)).toFixed(2) + ' Mb';
					}
					else
					{
						item.size = parseFloat(file.file.size / (1024 * 1024 * 1024)).toFixed(2) + ' Gb';
					}
				}
			});
		}

		/**
		 * Select an item
		 *
		 * @param item
		 */
		function select(item) {
			vm.selected = item;
		}

		// ---------------- Secondary -------------------


		function loadOpenCategories(id) {

			msApi.request('fileManager.category.get.categories@get', {id: id}, function (res) {
				vm.folders = res;
			}, apiAnswer.fail)

			msApi.request('fileManager.category.get.files@get', {id: id}, function (res) {
				vm.files = res
			}, apiAnswer.fail)

		}
	}
})();