var app = angular.module('cyt', []);
app.directive('stdItem', function () {
    return {
        restrict: 'AE',
        scope: {
            item: '=',
            items: '='
        },
        replace: true,
        template: '<div class="col-md-3 ingredient">\n    <label><img alt="" title="" ng-src="img/{{item.img}}"/>\n        <p>\n            <input name="{{item.type}}" ng-model="chosenBun" ng-change="updateBuns(item.id)" type="radio" ng-if="singleSelect && !report" value="{{item.id}}"> \n            <input name="{{item.type}}" ng-model="item.quantity" type="checkbox" ng-if="!singleSelect && !report"> \n            <strong>{{item.label}}</strong></p></label>\n</div>',
        link: function postLink(scope, element, attrs) {
            scope.singleSelect = attrs.singleSelect;
            scope.chosenBun = '';
            scope.report = angular.isDefined(attrs.report);
            scope.updateBuns = function(bun){
                scope.chosenBun = bun;
                scope.items[0].quantity = scope.items[0].id == bun ? 1 : 0;
                scope.items[1].quantity = scope.items[1].id == bun ? 1 : 0;
                scope.items[2].quantity = scope.items[2].id == bun ? 1 : 0;
            }
        }
    }
});
app.directive('pricedItem', function () {
    return {
        restrict: 'AE',
        scope: {
            item: '=',
            chosen: '='
        },
        replace: true,
        template: '<div class="col-md-3 ingredient">\n    <div ng-="incrementItem()" class="price" ng-class="{invisible: (!item.quantity && item.id != \'angusBeef\')}">{{(item.price*(item.quantity-item.init)).toFixed(2) | currency}}</div>\n    <label><img alt="" title="" ng-src="img/{{item.img}}" ng-click="incrementItem()" />\n        <strong ng-click="incrementItem()">{{item.label}}</strong>\n        <div class="mult" ng-show="item.quantity">x <span type="text" class="spinput">{{item.quantity}}</span><div class="minus" ng-click="decrementItem()"></div></div></label>\n</div>\n',
        link: function postLink(scope, element, attrs) {
            /*if(scope.item.quantity && angular.isUndefined(scope.chosen[scope.item.id])){
                scope.chosen[scope.item.id] = scope.item.quantity;
            }*/
            scope.incrementItem = function(){
                /*if(angular.isUndefined(scope.chosen[scope.item.id])){
                    scope.chosen[scope.item.id] = 0;
                }*/
                /*if(scope.chosen[scope.item.id] < scope.item.max){
                    scope.chosen[scope.item.id]++;
                }*/
                console.log('inc', scope.item);
                if(scope.item.quantity < scope.item.max){
                    scope.item.quantity++;
                } else {
                    $('.exceed').show();
                }
            }
            scope.decrementItem = function(){
                scope.item.quantity--;
            }
        }
    }
});
app.directive('reportItem', function () {
    return {
        restrict: 'AE',
        scope: {
            item: '=',
            chosen: '='
        },
        replace: true,
        template: '<div class="col-md-3 ingredient">\n    <div class="price" ng-class="{invisible: (!item.quantity && item.id != \'angusBeef\')}">{{(item.price*(item.quantity-item.init)).toFixed(2) | currency}}</div>\n    <label>\n        <img alt="" title="" ng-src="img/{{item.img}}" ng-click="incrementItem()" />\n        <strong ng-click="incrementItem()">{{item.label}}</strong>\n        <div class="mult" ng-show="item.quantity"><span ng-if="item.type == \'extras\'">x <input ng-model="item.quantity" type="text" class="spinput" value="0" readonly /></span><!--div class="minus" ng-click="decrementItem()"></div--></div></label>\n</div>\n',
        link: function postLink(scope, element, attrs) {
            scope.decrementItem = function(){
                scope.item.quantity--;
            }
        }
    }
});
app.controller('cytController', function ($scope, $timeout) {

    $scope.calcPrice = function(){
        var price = 8.95;
        angular.forEach($scope.items, function (item, key) {
            if(item.type == 'extras'){
                if(item.id == 'angusBeef'){
                    price += item.quantity*item.price-2.5;
                } else {
                    price += item.quantity*item.price;
                }
            }
        });
        return price;
    }

    $scope.resetSlick = function(){
        //$scope.
        $('.single-item').slick('unslick');
        $('.single-item').slick({
            dots: true,
            infinite: false
        });
        setUpItems();
    }

    $scope.closeExceed = function(){
        $('.exceed').hide();
    }

    function setUpItems(){
        $scope.items = [
            {id: 'toastedBrioche', type: 'bun', label: 'Toasted brioche', img: 't3-ingredients-pro-Toasted-brioche-style-bun.png', quantity: 0, max: 1},
            {id: 'bakersBun', type: 'bun', label: 'Bakers bun', img: 't3-ingredients-pro-bakers-bun.png', quantity: 0, max: 1},
            {id: 'lettuceWrap', type: 'bun', label: 'Lettuce wrap', img: 't3-ingredients-pro-lettuce-wrap_0.png', quantity: 0, max: 1},

            {id: 'naturalCheddar', type: 'cheese', label: 'Natural Cheddar', img: 't3-ingredients-pro-natural-cheddar_0.png', quantity: 0, max: 1},
            {id: 'colbyJack', type: 'cheese', label: 'Colby jack', img: 't3-ingredients-pro-colby-Jack_0.png', quantity: 0, max: 1},
            {id: 'swissCheese', type: 'cheese', label: 'Swiss Cheese', img: 't3-ingredients-pro-Swiss-cheese_0.png', quantity: 0, max: 1},
            {id: 'mcdClassicCheese', type: 'cheese', label: "McDonald's classic", img: 't3-ingredients-pro-McDonalds-classic-cheese_0.png', quantity: 0, max: 1},
            {id: 'shavedParmesan', type: 'cheese', label: 'Shaved parmesan', img: 't3-ingredients-pro-Shaved-parmesan_0.png', quantity: 0, max: 1},

            {id: 'angusBeef', type: 'extras', label: 'Angus beef', img: 't3-ingredients-pro-angus-beef_0.png', quantity: 1, init: 1, max: 2, price: 2.5},
            {id: 'crispyBacon', type: 'extras', label: 'Crispy bacon', img: 't3-ingredients-pro-crispy-bacon_0.png', quantity: 0, max: 5, price: 1},
            {id: 'rasherBacon', type: 'extras', label: 'Rasher bacon', img: 't3-ingredients-pro-rasher-bacon_0.png', quantity: 0, max: 5, price: 1},
            {id: 'egg', type: 'extras', label: 'Egg', img: 't3-ingredients-pro-egg_0.png', quantity: 0, max: 5, price: 1},
            {id: 'guacamole', type: 'extras', label: 'Guacamole', img: 't3-ingredients-pro-guacamole_0.png', quantity: 0, max: 5, price: 0.6},
            {id: 'tortillaStrips', type: 'extras', label: 'Tortilla strips', img: 't3-ingredients-pro-tortilla-strips_0.png', quantity: 0, max: 5, price: 0.6},
            {id: 'mushroom', type: 'extras', label: 'Grilled mushroom', img: 't3-ingredients-pro-grilled-mushroom-.png', quantity: 0, max: 5, price: 0.6},
            {id: 'pineapple', type: 'extras', label: 'Grilled pineapple', img: 't3-ingredients-pro-grilled-pineapple.png', quantity: 0, max: 5, price: 0.6},

            {id: 'ketchup', type: 'sauce', label: 'Ketchup', img: 't3-ingredients-pro-ketchup.png', quantity: 0, max: 1},
            {id: 'tomatoChilliJam', type: 'sauce', label: 'Tomato chilli jam', img: 't3-ingredients-pro-tomato-chilli-jam.png', quantity: 0, max: 1},
            {id: 'bbqDijonniase', type: 'sauce', label: 'BBQ dijonniase', img: 't3-ingredients-pro-bbq-dijonniase_0.png', quantity: 0, max: 1},
            {id: 'aioli', type: 'sauce', label: 'Aioli', img: 't3-ingredients-pro-aioli.png', quantity: 0, max: 1},
            {id: 'herbAioli', type: 'sauce', label: 'Herb aioli', img: 't3-ingredients-pro-herb-aioli.png', quantity: 0, max: 1},
            {id: 'specialSauce', type: 'sauce', label: 'Big Mac special', img: 't3-ingredients-pro-big-mac-special-sauce.png', quantity: 0, max: 1},
            {id: 'chipotleMayo', type: 'sauce', label: 'Chipotle mayo', img: 't3-ingredients-pro-chiptole-mayo.png', quantity: 0, max: 1},

            {id: 'wholeLeafLettuce', type: 'salad', label: 'Whole leaf lettuce', img: 't3-ingredients-pro-whole-leaf-lettuce.png', quantity: 0, max: 1},
            {id: 'jalapenos', type: 'salad', label: 'Jalapenos', img: 't3-ingredients-pro-jalapenos.png', quantity: 0, max: 1},
            {id: 'tomato', type: 'salad', label: 'Tomato', img: 't3-ingredients-pro-tomato.png', quantity: 0, max: 1},
            {id: 'caramelisedOnion', type: 'salad', label: 'Caramelised onion', img: 't3-ingredients-pro-caramelised-grilled-onion.png', quantity: 0, max: 1},
            {id: 'longPickle', type: 'salad', label: 'Long sliced pickle', img: 't3-ingredients-pro-long-sliced-pickle.png', quantity: 0, max: 1},
            {id: 'beetroot', type: 'salad', label: 'Sliced beetroot', img: 't3-ingredients-pro-slided-beetroot.png', quantity: 0, max: 1},
            {id: 'redOnion', type: 'salad', label: 'Red onion', img: 't3-ingredients-pro-red-onion.png', quantity: 0, max: 1}
        ];
    }
    setUpItems();

});