var fs = require('fs');
module.exports = function (app) {

  app.config([
    'formioComponentsProvider',
    function (formioComponentsProvider) {
      formioComponentsProvider.register('file', {
        title: 'File',
        template: 'formio/components/file.html',
        group: 'advanced',
        settings: {
          input: true,
          tableView: true,
          label: '',
          key: 'file',
          placeholder: '',
          multiple: false,
          defaultValue: '',
          protected: false
        }
      });
    }
  ]);

  app.directive('formioFileList', [function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        files: '=',
        form: '=',
        readOnly: '='
      },
      templateUrl: 'formio/components/formio-file-list.html',
      controller: [
        '$scope',
        function ($scope) {
          $scope.removeFile = function (event, index) {
            event.preventDefault();
            $scope.files.splice(index, 1);
          };

          $scope.fileSize = function (a, b, c, d, e) {
            return (b = Math, c = b.log, d = 1024, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2) + ' ' + (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes');
          };
        }
      ]
    };
  }]);

  app.directive('formioFile', [function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        file: '=',
        form: '='
      },
      template: '<a href="{{ file.url }}" ng-click="getFile($event)" target="_blank">{{ file.name }}</a>',
      controller: [
        '$scope',
        'FormioPlugins',
        function (
          $scope,
          FormioPlugins
        ) {
          $scope.getFile = function (evt) {
            var plugin = FormioPlugins('storage', $scope.file.storage);
            if (plugin) {
              plugin.downloadFile(evt, $scope.file, $scope);
            }
          };
        }
      ]
    };
  }]);

  app.controller('formioFileUpload', [
    '$scope',
    'FormioPlugins',
    function(
      $scope,
      FormioPlugins
    ) {
      $scope.fileUploads = {};

      $scope.removeUpload = function(index) {
        delete $scope.fileUploads[index];
      };

      // This fixes new fields having an empty space in the array.
      if ($scope.data && $scope.data[$scope.component.key] === '') {
        $scope.data[$scope.component.key] = [];
      }
      if ($scope.data && $scope.data[$scope.component.key][0] === '') {
        $scope.data[$scope.component.key].splice(0, 1);
      }

      $scope.upload = function(files) {
        if ($scope.component.storage && files && files.length) {
          var plugin = FormioPlugins('storage', $scope.component.storage);
          angular.forEach(files, function(file) {
            if (plugin) {
              $scope.fileUploads[file.name] = {
                name: file.name,
                size: file.size,
                status: 'info',
                message: 'Starting upload'
              };
              plugin.uploadFile(file, $scope.fileUploads[file.name], $scope)
                .then(function(fileInfo) {
                  delete $scope.fileUploads[file.name];
                  fileInfo.storage = $scope.component.storage;
                  $scope.data[$scope.component.key].push(fileInfo);
                })
                .catch(function(message) {
                  $scope.fileUploads[file.name].status = 'error';
                  $scope.fileUploads[file.name].message = message;
                  delete $scope.fileUploads[file.name].progress;
                });
            }
            else {
              $scope.fileUploads[file.name] = {
                name: file.name,
                size: file.size,
                status: 'error',
                message: 'Storage plugin not found'
              };
            }
          });
        }
      };
    }
  ]);
  app.run([
    '$templateCache',
    function (
      $templateCache
    ) {

      $templateCache.put('formio/components/formio-file-list.html',
        fs.readFileSync(__dirname + '/../templates/components/formio-file-list.html', 'utf8')
      );

      $templateCache.put('formio/components/file.html',
        fs.readFileSync(__dirname + '/../templates/components/file.html', 'utf8')
      );
    }
  ]);
};
