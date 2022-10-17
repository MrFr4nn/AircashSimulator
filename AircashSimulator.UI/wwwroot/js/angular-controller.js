/*
Template Name: Color Admin - Responsive Admin Dashboard Template build with Bootstrap 4
Version: 4.7.0
Author: Sean Ngu
Website: http://www.seantheme.com/color-admin/
   ----------------------------
        APPS CONTROLLER TABLE
   ----------------------------
	 1.0 CONTROLLER - App
	 
	 2.0 CONTROLLER - Sidebar
	 3.0 CONTROLLER - Right Sidebar
	 4.0 CONTROLLER - Header
	 5.0 CONTROLLER - Top Menu
	 
	 6.0 CONTROLLER - Home
   <!-- ======== GLOBAL SCRIPT SETTING ======== -->
*/

/* -------------------------------
   1.0 CONTROLLER - App
------------------------------- */
app.controller('appController', ['$rootScope', '$scope', function ($rootScope, $scope) {
 
  $scope.$on('$includeContentLoaded', function () {
    handleSlimScroll();
  });
  $scope.$on('$viewContentLoaded', function () {});
  $scope.$on('$stateChangeStart', function () {
    // reset layout setting
    $rootScope.setting.layout.pageSidebarMinified = false;
    $rootScope.setting.layout.pageFixedFooter = false;
    $rootScope.setting.layout.pageRightSidebar = false;
    $rootScope.setting.layout.pageTwoSidebar = false;
    $rootScope.setting.layout.pageTopMenu = false;
    $rootScope.setting.layout.pageBoxedLayout = false;
    $rootScope.setting.layout.pageWithoutSidebar = false;
    $rootScope.setting.layout.pageContentFullHeight = false;
    $rootScope.setting.layout.pageContentFullWidth = false;
    $rootScope.setting.layout.paceTop = false;
    $rootScope.setting.layout.pageLanguageBar = false;
    $rootScope.setting.layout.pageSidebarTransparent = false;
    $rootScope.setting.layout.pageWideSidebar = false;
    $rootScope.setting.layout.pageLightSidebar = false;
    $rootScope.setting.layout.pageWithFooter = false;
    $rootScope.setting.layout.pageMegaMenu = false;
    $rootScope.setting.layout.pageWithoutHeader = false;
    $rootScope.setting.layout.pageBgWhite = false;
    $rootScope.setting.layout.pageContentInverseMode = false;
    $rootScope.setting.layout.pageSidebarSearch = false;

    App.scrollTop();
    $('.pace .pace-progress').addClass('hide');
    $('.pace').removeClass('pace-inactive');
  });
  $scope.$on('$stateChangeSuccess', function () {
    Pace.restart();
    App.initPageLoad();
    App.initSidebarSelection();
    App.initSidebarMobileSelection();
    setTimeout(function () {
      App.initLocalStorage();
      App.initComponent();
    }, 0);
    if ($('#top-menu').length !== 0) {
      $('#top-menu').removeAttr('style');
    }
  });
  $scope.$on('$stateNotFound', function () {
    Pace.stop();
  });
  $scope.$on('$stateChangeError', function () {
    Pace.stop();
  });
    $rootScope.showGritter = function (title, text) {
        $.gritter.add({
            title: title,
            text: text,
            image: 'images/abonRed.png'
        });
        $("#gritter-notice-wrapper .gritter-item-wrapper .gritter-item .gritter-close")
            .attr('data-before', $rootScope.translations.gritter_close_button);
    }
}]);


/* -------------------------------
   2.0 CONTROLLER - Sidebar
------------------------------- */
app.controller('sidebarController', ['$scope', '$rootScope', '$state', 'JwtParser', '$localStorage', function ($scope, $rootScope, $state, JwtParser, $localStorage) {
  angular.element(document).ready(function () {
      $scope.pName = JwtParser.getProperty("pName");
  });
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
}]);


/* -------------------------------
   3.0 CONTROLLER - Right Sidebar
------------------------------- */
app.controller('rightSidebarController', function ($scope, $rootScope, $state) {
  angular.element(document).ready(function () {
  	// javascript / jQuery here
  });
});


/* -------------------------------
   4.0 CONTROLLER - Header
------------------------------- */
app.controller('headerController', function ($scope, $rootScope, $state, JwtParser) {
  angular.element(document).ready(function () {
      $scope.username = JwtParser.getProperty("unique_name");
  });
});


/* -------------------------------
   5.0 CONTROLLER - Top Menu
------------------------------- */
app.controller('topMenuController', function ($scope, $rootScope, $state) {
  angular.element(document).ready(function () {
  	// javascript / jQuery here
  });
});


/* -------------------------------
   6.0 CONTROLLER - Home
------------------------------- */
app.controller('homeController', function ($scope, $rootScope, $state) {
  angular.element(document).ready(function () {
    // javascript / jQuery here
  });
});

/* -------------------------------
   6.0 CONTROLLER - Page Loader
------------------------------- */
app.controller('pageLoaderController', function ($scope, $rootScope, $state) {
    angular.element(document).ready(function () {
        App.initPageLoad();
    });
});


/* -------------------------------
   7.0 CONTROLLER - SignalR
------------------------------- */

/*
app.controller("signalRController", function ($scope, signalR) {
    signalR.setHubName("notificationHub");
    signalR.client().broadcastMessage = function (msg) {
        var newNotification = { msg: msg};

        $scope.$apply(function () {
            $scope.message.push(newNotification);
        });
    };  
    signalR.start(function () {
        $scope.send = function () {
            //var dt = new Date();
            //var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
            signalR.server().send("Api request");
        }
    });

}); */


