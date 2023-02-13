(function () {
    'use strict';

    angular.module('LunchCheck', [])
        .controller('LunchCheckController', LunchCheckController);
    LunchCheckController.$inject = ['$scope'];

    function LunchCheckController($scope) {
        $scope.lunch = "";
        $scope.message = "";

        $scope.checkTooMuch = function () {
            if ($scope.lunch === "") {
                $scope.message = "Please enter data first";
                return;
            }
            var msg = $scope.lunch.split(",");
            if (msg.length <= 3) {
                $scope.message = "Enjoy!";
            } else $scope.message = "Too much!";
        };
    }
})();
