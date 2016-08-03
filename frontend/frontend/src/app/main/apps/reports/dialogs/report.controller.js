(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ReportDialogController', ComposeDialogController);

    /** @ngInject */
    function ComposeDialogController($rootScope, msApi, $scope, Categories, Files, apiAnswer, currentFolder)
    {
      var vm = this;

      vm.formData = new FormData()

      vm.hide = hide;
      vm.createReport = createReport;

       //- -----------------------------------------


      function createReport() {
        console.log(4)
        var place = $rootScope.currentPlace;

        for(var key in vm.report) {
          vm.formData.append(key, vm.report[key])
        }

        if(currentFolder && !vm.report.category) {
          vm.formData.append('category', currentFolder);
        }


        msApi.request('reports.create.report@create', vm.formData, function (res) {
          apiAnswer.success();

          vm.report.category || Files.push(res)
        }, apiAnswer.fail)
      }

      function hide() {
        $mdDialog.hide();
      }
    }
})();
