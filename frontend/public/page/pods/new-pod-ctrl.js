angular.module('app')
.controller('NewPodCtrl', function(_, $scope, $location, $routeParams, PodsSvc,
      ModalLauncherSvc) {
  'use strict';

  $scope.pod = {
    id: null,
    labels: null,

    desiredState: {
      manifest: {
        version: 'v1beta1',
        id: null,
        containers: []
      }
    },
  };

  $scope.container = {
    name: null,
    image: null,
    ports: null,
    env: null,
    volumes: null
  };

  $scope.fields = {
    containerImage: null,
    containerTag: null
  };

  function updateImage(image, tag) {
    $scope.container.image = (image || $scope.fields.containerImage) + ':' + (tag || $scope.fields.containerTag);
  }

  $scope.$watch('fields.containerImage', function(image) {
    if (image) {
      updateImage(image, null);
    }
  });
  $scope.$watch('fields.containerTag', function(tag) {
    if (tag) {
      updateImage(null, tag);
    }
  });
  $scope.$watch('pod.id', function(id) {
    $scope.pod.desiredState.manifest.id = id;
  });

  $scope.openPortsModal = function() {
    ModalLauncherSvc.open('configure-ports', {
      ports: $scope.container.ports
    })
    .result.then(function(result) {
      $scope.container.ports = result;
    });
  };

  $scope.save = function() {
    if (_.isEmpty($scope.container.ports)) {
      $scope.container.ports = null;
    }
    $scope.pod.desiredState.manifest.containers.push($scope.container);
    $scope.requestPromise = PodsSvc.create($scope.pod);
    $scope.requestPromise.then(function() {
      $location.path('/pods');
    });
  };

})

.controller('NewPodFormCtrl', function($scope) {
  'use strict';

  $scope.submit = $scope.save;
});
