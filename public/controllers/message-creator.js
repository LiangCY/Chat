angular.module('chatApp').controller('MessageCreatorCtrl', ['$scope', 'socket',
    function ($scope, socket) {
        $scope.newMessage = '';
        $scope.createMessage = function () {
            if ($scope.newMessage == '') {
                return;
            }
            socket.emit('chat', {
                action: 'createMessage',
                data: {
                    content: $scope.newMessage,
                    creator: $scope.me
                }
            });
            $scope.newMessage = '';
        };
    }
]);