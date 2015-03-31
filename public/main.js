angular.module('chatApp', ['ngRoute','angularMoment']);

angular.module('chatApp').config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'pages/room.html',
        controller: 'RoomCtrl'
    }).when('/login', {
        templateUrl: 'pages/login.html',
        controller: 'LoginCtrl'
    }).otherwise({
        redirectTo: '/login'
    });
});


angular.module('chatApp').run(function ($window, $rootScope, $http, $location) {
    $http({
        url: '/api/validate',
        method: 'GET'
    }).success(function (user) {
        $rootScope.me = user;
        $location.path('/');
    }).error(function () {
        $location.path('/login');
    });
    $rootScope.logout = function () {
        $http({
            url: '/api/logout',
            method: 'GET'
        }).success(function () {
            $rootScope.me = null;
            $location.path('/login');
        });
    };
    $rootScope.$on('login', function (evt, me) {
        $rootScope.me = me;
    });
});