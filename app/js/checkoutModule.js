'use strict';

var checkoutModule = angular.module('checkoutModule', ['ui.bootstrap']);


checkoutModule.controller('mainController', function($scope, checkOutService,$modal ) {
    $scope.name = 'jiten';

    $scope.changeName = function() {
        $scope.name = 'jitendra singhal';
    };

    $scope.openModal = function(itemId){
        $modal.open({
            templateUrl: 'myModalContent.html', // loads the template
            backdrop: true, // setting backdrop allows us to close the modal window on clicking outside the modal window
            windowClass: 'modal', // windowClass - additional CSS class(es) to be added to a modal window template
            controller: function ($scope, $modalInstance) {
            	$scope.id = itemId;
                $scope.submit = function () {
                    $modalInstance.dismiss('cancel'); // dismiss(reason) - a method that can be used to dismiss a modal, passing a reason
                }
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel'); 
                };
            }
        });
    };

    function init(){
    	//alert('Hi');
    	checkOutService.getJsonObject()
    		.then(function(response){
    			$scope.data = response.data;
    			$scope.subTotal = checkOutService.subTotal;
    			$scope.totalItems = checkOutService.totalItems;
    			$scope.promoCode = checkOutService.promoCode;
    			$scope.discountValue = checkOutService.discountValue;
    		});
    }

    init();
});

checkoutModule.service('checkOutService', function($http, $q) {
	var self = this;
	self.promoCode = '';
	self.discountValue=0;

	self.getJsonObject = function() {
		var url='https://api.myjson.com/bins/19ynm&callback=callbackFN';
		var deferred = $q.defer();
         $http.get(url)
         	.then(function(response) {
      			self.serviceModel = response.data; 
      			calculateSubTotal();
      			checkEligibilityForDiscount();
      			deferred.resolve(response);
   			});
   		return deferred.promise;
   };

   function calculateSubTotal(){
   	self.subTotal=0;
   	self.totalItems = 0;
   	angular.forEach(self.serviceModel.productsInCart, function(item){
   		self.subTotal = self.subTotal + item.p_originalprice;
   		self.totalItems++;
   	});
   }

   function checkEligibilityForDiscount(){
   	if(self.totalItems>=10){
   		applyDiscount(25);
   		self.promoCode = 'promo25';
   	}
   	else if(self.totalItems>6){
   		applyDiscount(15);
   		self.promoCode = 'promo15';
   	}
   	else if(self.totalItems>3){
   		applyDiscount(10);
   		self.promoCode = 'promo10';
   	}
   	else if(self.totalItems=3){
   		applyDiscount(5);
   		self.promoCode = 'promo5';
   	}
   }

   function applyDiscount(discount){
   	self.discountValue = (discount*self.subTotal)/100;
   }

});

var ModalInstanceCtrl = function ($scope, $modalInstance, items, selected) {

  $scope.items = items;
  $scope.selected = {
    item: selected || items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};