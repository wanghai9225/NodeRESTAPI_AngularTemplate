(function ()
{
  'use strict';

  angular
    .module('app.users')
    .controller('UsersController', UsersController);

  /** @ngInject */
  function UsersController($scope, $mdSidenav, Users, msUtils, $mdDialog, $document)
  {

    var vm = this;
    console.log(Users);
    // Data
    vm.users = Users;
    //vm.user = User.data;
    vm.filterIds = null;
    vm.listType = 'all';
    vm.listOrder = 'username';
    vm.listOrderAsc = false;
    vm.selectedContacts = [];
    vm.newGroupName = '';

    // Methods

    vm.toggleSelectContact = toggleSelectContact;
    vm.deselectContacts = deselectContacts;
    vm.deleteSelectedContacts = deleteSelectedContacts;
    vm.selectAllContacts = selectAllContacts;
    vm.exists = msUtils.exists;
    vm.addUser = addUser;
    vm.openContactDialog = openContactDialog;

    //////////

    function openContactDialog($event, contact) {
      $mdDialog.show({
        controller: 'UserEditDialogController',
        controllerAs: 'vm',
        locals: {
          contact: contact
        },
        templateUrl: 'app/main/apps/users/dialogs/user-edit.html',
        clickOutsideToClose: true
      });

    }

    function addUser() {
      $mdDialog.show({
        controller: 'UserAddDialogController',
        controllerAs: 'vm',
        locals: {
          selectedMail: undefined
        },
        templateUrl: 'app/main/apps/users/dialogs/user-add.html',
        clickOutsideToClose: true
      });
    }


    /**
     * Toggle selected status of the contact
     *
     * @param contact
     * @param event
     */
    function toggleSelectContact(contact, event)
    {
      if ( event )
      {
        event.stopPropagation();
      }

      if ( vm.selectedContacts.indexOf(contact) > -1 )
      {
        vm.selectedContacts.splice(vm.selectedContacts.indexOf(contact), 1);
      }
      else
      {
        vm.selectedContacts.push(contact);
      }
    }

        /**
     * Delete Selected Contacts
     */
    function deleteSelectedContacts(ev)
    {
      var confirm = $mdDialog.confirm()
        .title('Are you sure want to delete the selected contacts?')
        .htmlContent('<b>' + vm.selectedContacts.length + ' selected</b>' + ' will be deleted.')
        .ariaLabel('delete users')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function ()
      {

        vm.selectedContacts.forEach(function (contact)
        {
          deleteContact(contact);
        });

        vm.selectedContacts = [];

      });

    }

    /**
     * Deselect contacts
     */
    function deselectContacts()
    {
      vm.selectedContacts = [];
    }

    /**
     * Sselect all contacts
     */
    function selectAllContacts()
    {
      vm.selectedContacts = $scope.filteredContacts;
    }

  }

})();