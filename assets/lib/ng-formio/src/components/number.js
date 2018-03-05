var fs = require('fs');

module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(formioComponentsProvider) {
      var isNumeric = function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      };
      formioComponentsProvider.register('number', {
        title: 'Number',
        template: 'formio/components/number.html',
        settings: {
          autofocus: false,
          input: true,
          tableView: true,
          inputType: 'number',
          label: 'Number',
          key: 'number',
          placeholder: '',
          prefix: '',
          suffix: '',
          defaultValue: '',
          protected: false,
          persistent: true,
          hidden: false,
          clearOnHide: true,
          validate: {
            required: false,
            min: '',
            max: '',
            step: 'any',
            integer: '',
            multiple: '',
            custom: ''
          }
        },
        controller: ['$scope', function($scope) {
          if ($scope.options && $scope.options.building) return; // FOR-71 - Skip parsing input data.

          // Ensure that values are numbers.
          if ($scope.data && $scope.data.hasOwnProperty($scope.component.key)) {
            if (Array.isArray($scope.data[$scope.component.key])) {
              $scope.data[$scope.component.key].forEach(function(value, index) {
                if (!isNumeric(value)) {
                  $scope.data[$scope.component.key][index] = parseFloat(value);
                }
              });
            }
            else if (!isNumeric($scope.data[$scope.component.key])) {
              $scope.data[$scope.component.key] = parseFloat($scope.data[$scope.component.key]);
            }
          }
        }]
      });
    }
  ]);

  app.run([
    '$templateCache',
    'FormioUtils',
    function($templateCache, FormioUtils) {
      $templateCache.put('formio/components/number.html', FormioUtils.fieldWrap(
        fs.readFileSync(__dirname + '/../templates/components/number.html', 'utf8')
      ));
    }
  ]);
};
