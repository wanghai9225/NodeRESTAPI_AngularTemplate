(function ()
{
    'use strict';

    angular
        .module('app.contacts')
        .controller('ContactsController', ContactsController);

    /** @ngInject */
    function ContactsController($mdSidenav, $mdDialog, Documents) {
        var vm = this;

        vm.contactEditModel = contactEditModel;
        vm.content = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit necessitatibus aut repellat aliquid accusamus placeat laborum perferendis cupiditate! Ipsa itaque neque id qui voluptatem, ab tempora. Dolorem dolore deserunt atque.'

        //////////

        function contactEditModel() {
          $mdDialog.show({
            locals: {contentToEdit: vm.content},
            controller: 'ContactsEditController',
            controllerAs       : 'vm',
            templateUrl        : 'app/main/apps/contacts/dialogs/edit-contact.html',
            clickOutsideToClose: true,
            resolve: {
              saveContact: function () {
                return function (text) {
                  vm.content = text;
                }
              }
            }
          })
        }
    }
})();