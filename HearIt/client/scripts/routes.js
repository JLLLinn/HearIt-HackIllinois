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
    });

  $urlRouterProvider.otherwise('tab/sounds');
}
