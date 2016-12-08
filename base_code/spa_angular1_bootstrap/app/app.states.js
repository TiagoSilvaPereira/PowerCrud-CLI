angular.module('{%angularAppName%}')
.config(['$stateProvider', '$urlRouterProvider', 
    
function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise('/404');
    $urlRouterProvider.when('', '/');

    $stateProvider
        .state('root',{
          url: '',
          abstract: true,
          views: {
            'header': {
              templateUrl: 'app/components/layout/views/header.html'
            },
            'sidebar': {
                templateUrl: 'app/components/layout/views/sidebar.html'
            },
            'breadcrumb': {
                templateUrl: 'app/components/layout/views/breadcrumb.html'
            },
            'footer':{
              templateUrl: 'app/components/layout/views/footer.html',
            }
          }
        })
        .state('root.home', {
            url: '/',
            views: {
                'main@': {
                    templateUrl: 'app/components/home/views/home.html',
                    controller: "homeController as vm" 
                }
            }
            
        })
{%states%}
        .state('root.404', {
            url: '/404',
            views: {
                'main@': {
                    templateUrl: 'app/shared/404.html'
                }
            }
        });
}]);