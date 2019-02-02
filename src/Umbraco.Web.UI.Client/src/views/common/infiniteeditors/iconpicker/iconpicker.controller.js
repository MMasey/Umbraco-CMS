/**
 * @ngdoc controller
 * @name Umbraco.Editors.IconPickerController
 * @function
 *
 * @description
 * The controller for the content type editor icon picker
 */
function IconPickerController($scope, $http, $sce, localizationService, umbRequestHelper) {

    var vm = this;

    vm.selectIcon = selectIcon;
    vm.selectColor = selectColor;
    vm.submit = submit;
    vm.close = close;

    vm.colors = [
        { name: "Black", value: "color-black" },
        { name: "Blue Grey", value: "color-blue-grey" },
        { name: "Grey", value: "color-grey" },
        { name: "Brown", value: "color-brown" },
        { name: "Blue", value: "color-blue" },
        { name: "Light Blue", value: "color-light-blue" },
        { name: "Indigo", value: "color-indigo" },
        { name: "Purple", value: "color-purple" },
        { name: "Deep Purple", value: "color-deep-purple" },
        { name: "Cyan", value: "color-cyan" },
        { name: "Green", value: "color-green" },
        { name: "Light Green", value: "color-light-green" },
        { name: "Lime", value: "color-lime" },
        { name: "Yellow", value: "color-yellow" },
        { name: "Amber", value: "color-amber" },
        { name: "Orange", value: "color-orange" },
        { name: "Deep Orange", value: "color-deep-orange" },
        { name: "Red", value: "color-red" },
        { name: "Pink", value: "color-pink" }
    ];

    function onInit() {

        vm.loading = true;

        setTitle();
    
        // iconHelper.getIcons().then(function (icons) {
        //     vm.icons = icons;
        //     vm.loading = false;
        // });

        umbRequestHelper.resourcePromise(
            $http.get(Umbraco.Sys.ServerVariables.umbracoUrls.iconApiBaseUrl + "GetAllIcons")
        ,'Failed to retrieve icons')
        .then(icons => {
            var trustedIcons = [];
            
            icons.forEach(icon => {
                trustedIcons.push({
                    name: icon.Name,
                    svgString: $sce.trustAsHtml(icon.SvgString)
                })
            });

            vm.icons = trustedIcons;

            vm.loading = false;
        });

        // set a default color if nothing is passed in
        vm.color = $scope.model.color ? $scope.model.color : vm.colors[0].value;

        // if an icon is passed in - preselect it
        vm.icon = $scope.model.icon ? $scope.model.icon : undefined;
    }

    function setTitle() {
        if (!$scope.model.title) {
            localizationService.localize("defaultdialogs_selectIcon")
                .then(function(data){
                    $scope.model.title = data;
                });
        }
    }

    function selectIcon(icon, color) {
        $scope.model.icon = icon;
        $scope.model.color = color;
        submit();
    }

    function selectColor(color, $index, $event) {
        $scope.model.color = color;
    }

    function close() {
        if($scope.model && $scope.model.close) {
            $scope.model.close();
        }
    }

    function submit() {
        if ($scope.model && $scope.model.submit) {            
            $scope.model.submit($scope.model);
        }
    }

    onInit();

}

angular.module("umbraco").controller("Umbraco.Editors.IconPickerController", IconPickerController);
