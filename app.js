(function () {
'use strict';

angular.module('ShoppingListDirectiveApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.directive('foundItems', FoundItemsDirective)
.service('MenuCategoriesService', MenuCategoriesService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'shoppingList.html',
    scope: {
      items: '<',
      mySearch: '@search',
      
      onRemove: '&'
    },
    controller: ShoppingListDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}


function ShoppingListDirectiveController() {
  var list = this;
  list.items=[];
  // list.error = list.items.length ===0 ?"nothing found" : "";

}


NarrowItDownController.$inject = ['MenuCategoriesService'];
function NarrowItDownController(MenuCategoriesService) {
  
    var NarDownCTRL = this;
  NarDownCTRL.searchFor = "";

NarDownCTRL.showError=false;
  

 
  NarDownCTRL.getAll = function(){
    NarDownCTRL.found = MenuCategoriesService.getMenuCategories(NarDownCTRL.searchFor);
  console.log(NarDownCTRL.found);
  }

    NarDownCTRL.getAll = function () {
    MenuCategoriesService.getMenuCategories(NarDownCTRL.searchFor.toLowerCase())
    .then(function (response) {
       NarDownCTRL.found = response;

      if ( NarDownCTRL.found.length) {
        NarDownCTRL.showError = false;
      } else {

        NarDownCTRL.showError = true;
        console.log(NarDownCTRL.showError);
      }
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
    });
  };
  //   console.log("i am");
  //   NarDownCTRL.found=[];
  //   var promise = MenuCategoriesService.getMenuCategories();

  //   promise.then(function (response) {

      
  //      for (var i = 0; i < response.data.length ; i++) {
  //         var namedesc = response.data[i].name;
  //         var insdes = response.data[i].special_instructions;

  //         if((namedesc.toLowerCase().indexOf(NarDownCTRL.searchFor)!= - 1)
  //           || (insdes.toLowerCase().indexOf(NarDownCTRL.searchFor.toLowerCase())!= - 1)){
           
  //             NarDownCTRL.found.push(response.data[i]);
  //          }
  //      }
      
  //     })
  //     .catch(function (error) {
  //       console.log("Something went terribly wrong.");
  //     });
  // }

  NarDownCTRL.removeItem = function (itemIndex) {
      NarDownCTRL.found.splice(itemIndex,1);
  };
}




MenuCategoriesService.$inject = ['$http', 'ApiBasePath'];
function MenuCategoriesService($http, ApiBasePath) {
  var service = this;

  service.getMenuCategories = function (searchTerm) {
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),
    })
    .then(function (response) {
      var foundItems = response.data.menu_items;
      if (searchTerm === "") {
        return [];
      } else {
        return foundItems.filter(item=>item.description.includes(searchTerm));
      }
    });
  };




}


})();

