angular.module('chatApp').controller('RoomCtrl', ['$scope', 'socket',
    function ($scope, socket) {

        socket.emit('chat', {
            action: 'getRoom'
        });

        socket.on('chat', function (res) {
            console.log(res);
            switch (res.action) {
                case 'roomData':
                    $scope.room = res.data;
                    break;
                case  'messageAdded':
                    $scope.room.messages.push(res.data);
                    break;
                case 'online':
                    $scope.room.users.push(res.data);
                    break;
                case  'offline':
                    var _userId = res.data._id;
                    $scope.room.users = $scope.room.users.filter(function (user) {
                        return user._id != _userId;
                    });
                    break
            }
        });

        //socket.on('roomData', function (room) {
        //    $scope.room = room;
        //});
        //
        //socket.on('messageAdded', function (message) {
        //    $scope.room.messages.push(message);
        //});
        //
        //socket.on('online', function (user) {
        //    $scope.room.users.push(user);
        //});
        //socket.on('offline', function (user) {
        //    var _userId = user._id;
        //    $scope.room.users = $scope.room.users.filter(function (user) {
        //        return user._id != _userId;
        //    })
        //});
    }
]);