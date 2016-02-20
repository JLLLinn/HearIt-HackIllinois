angular
  .module('HearIt', [
    'angular-meteor',
    'ionic',
    'accounts.ui'
  ]);

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
}
else {
  angular.element(document).ready(onReady);
}

function onReady() {
  angular.bootstrap(document, ['HearIt']);
}

Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });
