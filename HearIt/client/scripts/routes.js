angular
  .module('HearIt')
  .config(config);

function config($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'client/templates/tabs.html'
    })
    .state('tab.sounds', {
      url: '/sounds',
      views: {
        'tab-sounds': {
          templateUrl: 'client/templates/sounds.html'
        }
      }
    })
    .state('tab.top-sounds', {
      url: '/top-sounds',
      views: {
        'tab-top-sounds': {
          templateUrl: 'client/templates/top-sounds.html'
        }
      }
    })
    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'client/templates/account.html',
          controller: 'ProfileCtrl'
        }
      }
    });
    // .state('login', {
    //   url: '/login',
    //   templateUrl: 'client/templates/login.html',
    //   controller: 'LoginCtrl'
    // });

  $urlRouterProvider.otherwise('tab/sounds');
}
