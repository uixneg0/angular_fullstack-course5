(function () {
    'use strict';

    angular.module('App', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', foundItemsDirective)
        .constant('ApiUrl', "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json");


    function foundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            controller: NarrowItDownController,
            controllerAs: 'controller',
            scope: {
                items: '<',
                onRemove: '&',
            },
            bindToController: true,
        };

        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        this.found = [];
        this.searchTerm = "";
        this.service = MenuSearchService;
        this.findItemsCalled = false;

        this.findItems = function () {
            this.findItemsCalled = true;
            var promise = this.service.getMatchedMenuItems(this.searchTerm);
            promise.then((result) => {
                this.found = result;
            });
        }

        this.removeItem = function (index) {
            this.found.splice(index, 1);
        }

        this.shouldShowNothingFound = function (){
            return this.found.length === 0 && this.findItemsCalled;
        }
    }

    MenuSearchService.$inject = ['$http', 'ApiUrl'];

    function MenuSearchService($http, ApiUrl) {
        this.getMatchedMenuItems = function (searchTerm) {
            searchTerm = searchTerm.toLowerCase();
            var promise = this.getMenuItems()
                .then(function (response) {
                    var matchedItems = [];
                    if (searchTerm === "") return matchedItems;
                    var responseData = response.data;
                    var keys = Object.keys(responseData);
                    keys.forEach(key => {
                        var menuItems = responseData[key]["menu_items"];
                        menuItems.forEach(menuItem => {
                            if (menuItem.description.toLowerCase().includes(searchTerm)) {
                                matchedItems.push(new Item(menuItem.name, menuItem.short_name, menuItem.description))
                            }
                        });
                    });
                    return matchedItems;
                })
                .catch(function (error) {
                    console.log(error);
                });
            return promise;
        };

        this.getMenuItems = function () {
            return $http({
                method: "GET",
                url: (ApiUrl),
                response: "json"
            });
        };

    }


    class Item {
        constructor(name, shortName, description) {
            this.name = name;
            this.shortName = shortName;
            this.description = description;
        }
    }

})();
