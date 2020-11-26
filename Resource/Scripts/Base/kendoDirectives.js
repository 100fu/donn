/// <reference path="/Scripts/angular/angular-1.0.8.min.js" />
/// <reference path="eap.ui.js" />
/// <reference path="eap.kendo.js" />

(function () {
    var getValue = function (value) {
        var result = value;
        if (typeof value === "string" && value.indexOf("#") == 0)
            result = System.getValue(window, value.substr(1, value.length - 1))
        return result;
    }
    'use strict';

    angular
        .module('EAMDirecives', [])
        .directive('searchbox', Directive);

    // Directive.$inject = ['dependency1'];
    function Directive() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: ControllerController,
            controllerAs: 'vm',
            link: link,
            restrict: 'EA',
            scope: true
        };
        return directive;

        function link(scope, element, attrs) {
            if (EAP.UI.DirectiveControls[attrs.name]) return;
            var option = new EAP.UI.VinciSearchBoxOptions();
            var fieldName = attrs.kname;
            var kTest = new RegExp("^k");
            for (name in attrs) {
                var result = kTest.test(name);
                if (result) {
                    var kname = name.substr(1, name.length - 1);
                    var aValue = attrs[name];
                    try {
                        aValue = JSON.parse(aValue);
                    } catch (e) { }
                    if (kname.indexOf('.') > -1) {
                        var array = kname.split('.');
                        var tOption = option;
                        for (var i = 0; i < array.length - 1; i++) {
                            switch (array[i]) {
                                case 'gridOptions':
                                    if (!tOption[array[i]]) tOption = tOption[array[i]] = new EAP.UI.GridOption();
                                    break;
                                case 'gridDateRequestOptions':
                                    if (!tOption[array[i]]) tOption[array[i]] = new EAP.UI.GridDataRequest();
                                    tOption = tOption[array[i]];
                                    break;
                                default:
                                    if (!tOption[array[i]]) tOption = tOption[array[i]] = angular.isObject(tOption[array[i]]) || {};
                            }
                        }
                        tOption[array[array.length - 1]] = getValue(aValue);
                    } else {
                        option[kname] = getValue(aValue);
                    }
                }
            }


            var editable = attrs.editable;
            option.setSource = function (e) {
                if (fieldName)
                    scope.$apply(fieldName + "='" + (attrs.keditable ? e.text : e.value) + "'");
                if (attrs.ngModel)
                    scope.$apply(attrs.ngModel + "='" + $(element).val() + "'");
            }
            $(element).on("change", function() {
                if(attrs.ngModel)
                    scope.$apply(attrs.ngModel + "='" +$(element).val()+ "'");
            })
            if (attrs.name)//为了能够将控件找到请填写不同的name
                EAP.UI.DirectiveControls[attrs.name] = new EAP.UI.VinciSearchBox(element, option);
        }

    }
    /* @ngInject */
    function ControllerController() {

    }
})();