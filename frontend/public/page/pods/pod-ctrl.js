angular.module('app')
.controller('PodCtrl', function($scope, $routeParams, k8s) {
  'use strict';

  $scope.ns = $routeParams.ns;

  k8s.pods.get($routeParams.name, $scope.ns).then(function(pod) {
    $scope.pod = pod;
  });

  $scope.getContainerInfo = function(containerName) {
    if ($scope.pod.status && $scope.pod.status.info) {
      return $scope.pod.status.info[containerName];
    }
  };

  $scope.getContainerState = function(containerName) {
    var cinfo = $scope.getContainerInfo(containerName);
    return k8s.docker.getState(cinfo);
  };

});
