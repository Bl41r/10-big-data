(function(module) {
  var zip = {};
  var modifiedData = [];
  var top5 = [];

  function removeDuplicates(list) {
    for (var l = 0; l < list.length; l++) {
      for (var m = 0; m < list.length; m++) {
        if (list[l].neighborhood === list[m].neighborhood && l != m) {
          list.splice(m, 1);
          m--;
        }
      }
    }
    return list;
  }

  function transformData(data) {
    modifiedData = data.features.map(function(obj) {
      return {
        address : obj.properties.address,
        neighborhood: obj.properties.neighborhood,
        zip: obj.properties.zip,
        coordinates: {lng: obj.geometry.coordinates[0], lat: obj.geometry.coordinates[1]}
      };
    });

    modifiedData.forEach(function(loc) {
      if (loc.address === '') {
        loc.address = null;
      }
    });

    top5 = modifiedData.map(function(obj) {
      return {
        neighborhood: obj.neighborhood,
        count: modifiedData.filter(function(o) {
          return o.neighborhood === obj.neighborhood;
        }).length
      };
    });

    top5 = removeDuplicates(top5);

    top5.sort(function(a,b) {
      return b.count - a.count;
    });

    top5 = [top5[0], top5[1], top5[2], top5[3], top5[4]];
    console.log('top5: ', top5);
  }

  function loadData(data) {
    zip = data;
    transformData(zip);

    zip.modifiedData = modifiedData;
    zip.top5 = top5;
    module.zip = zip;
  }

  getData = function(nextFunction) {
    $.getJSON('/data/manhattan.json', function(data) {
      nextFunction(data);
    });
  };
  getData(loadData);
})(window);
