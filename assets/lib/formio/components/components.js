app.provider('formioComponents', function() {
  var components = {};
  var groups = {
    __component: {
      title: 'Form Components'
    },
    layout: {
      title: 'Layout Components'
    }
  };
  return {
    addGroup: function(name, group) {
      groups[name] = group;
    },
    register: function(type, component, group) {
      if (!components[type]) {
        components[type] = component;
      }
      else {
        angular.extend(components[type], component);
      }

      // Set the type for this component.
      if (!components[type].group) {
        components[type].group = group || '__component';
      }
      components[type].settings.type = type;
    },
    $get: function() {
      return {
        components: components,
        groups: groups
      };
    }
  };
});
