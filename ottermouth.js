(function() {

  var Tooth = function(id, config) {
    this.id = id;
    this.pupRange = this.computeRange_(config.pupRange);
    this.eruptRange = this.computeRange_(config.eruptRange);
    this.adultRange = this.computeRange_(config.adultRange);
    this.notPresentRange = this.computeRange_([1, 52]);
  };
  Tooth.prototype.PUP_RANGE_KEY = 'pupRange';
  Tooth.prototype.ERUPT_RANGE_KEY = 'eruptRange';
  Tooth.prototype.ADULT_RANGE_KEY = 'adultRange';
  Tooth.prototype.NOT_PRESENT_RANGE_KEY = 'notPresentRange';
  Tooth.prototype.RANGE_LABEL_MAP = {
    pupRange: 'Pup',
    eruptRange: 'Erupt',
    adultRange: 'Adult',
    notPresentRange: 'Not present'
  };
  Tooth.prototype.computeRange_ = function(range) {
    if (!range) {
      return null;
    }
    return {
      min: range[0],
      max: range[1]
    };
  };

  // Namespace
  var ottermouth = {};

  ottermouth.OTTER_TEETH = [
      // Upper
      new Tooth('UI-1', {
        pupRange: [1, 9],
        eruptRange: [5, 9],
        adultRange: [10, 52]
      }),
      new Tooth('UI-2', {
        pupRange: [1, 9],
        eruptRange: [7, 10],
        adultRange: [11, 52]
      }),
      new Tooth('UI-3', {
        pupRange: [1, 9],
        eruptRange: [10, 12],
        adultRange: [13, 52]
      }),
      new Tooth('UC', {
        pupRange: [1, 15],
        eruptRange: [16, 19],
        adultRange: [20, 52]
      }),
      new Tooth('UPM-1', {
        pupRange: [1, 8],
        eruptRange: [9, 10],
        adultRange: [11, 52]
      }),
      new Tooth('UPM-2', {
        pupRange: [4, 6],
        eruptRange: [28, 31],
        adultRange: [32, 52]
      }),
      new Tooth('UPM-3', {
        pupRange: [6, 10],
        eruptRange: [32, 36],
        adultRange: [37, 52]
      }),
      // Adult only upper
      new Tooth('UM-1', {
        eruptRange: [22, 25],
        adultRange: [26, 52]
      }),
      // Adult only lower
      new Tooth('LI-1', {
        eruptRange: [7, 9],
        adultRange: [10, 52]
      }),
      new Tooth('LI-2', {
        eruptRange: [9, 10],
        adultRange: [11, 52]
      }),

      // Lower
      new Tooth('LC', {
        pupRange: [1, 19],
        eruptRange: [16, 19],
        adultRange: [20, 52]
      }),
      new Tooth('LPM-1', {
        pupRange: [1, 8],
        eruptRange: [9, 10],
        adultRange: [11, 52]
      }),
      new Tooth('LPM-2', {
        pupRange: [2, 5],
        eruptRange: [27, 31],
        adultRange: [32, 52]
      }),
      new Tooth('LPM-3', {
        pupRange: [4, 6],
        eruptRange: [31, 36],
        adultRange: [37, 52]
      }),
      new Tooth('LM-1', {
        eruptRange: [19, 26],
        adultRange: [27, 52]
      }),
      new Tooth('LM-2', {
        eruptRange: [25, 30],
        adultRange: [31, 52]
      })];

  ottermouth.Controller = function() {
    this.teeth = ottermouth.OTTER_TEETH;
    this.currentTooth = null;
    this.showingResults = false;
    this.presentTeeth = {};

    this.toothIdMap_ = this.buildMap_(this.teeth);
    this.toothIter_ = null;

    this.reset();
  };

  ottermouth.Controller.prototype.buildMap_ = function(teeth) {
    var map = {};
    teeth.forEach(function(tooth) {
      map[tooth.id] = tooth;
    });
    return map;
  };

  ottermouth.Controller.prototype.onResultsPage = function() {
    return this.toothIter_ == this.teeth.length;
  };

  ottermouth.Controller.prototype.hasPupRange = function(toothId) {
    return this.toothIdMap_[toothId].pupRange;
  };

  ottermouth.Controller.prototype.hasEruptRange = function(toothId) {
    return this.toothIdMap_[toothId].eruptRange;
  };

  ottermouth.Controller.prototype.hasAdultRange = function(toothId) {
    return this.toothIdMap_[toothId].adultRange;
  };

  ottermouth.Controller.prototype.goTo = function(toothId) {
    var index;
    this.teeth.forEach(function(t, i) {
      if (t.id === toothId) {
        index = i;
      }
    });
    this.setCurrentTooth_(index);
  };

  ottermouth.Controller.prototype.openMenu = function() {

  };

  ottermouth.Controller.prototype.goToResults = function() {
    this.toothIter_ = this.teeth.length;
  };

  ottermouth.Controller.prototype.setTooth = function(toothId, toothRange) {
    this.presentTeeth[toothId] = toothRange;
    this.next();
  };

  ottermouth.Controller.prototype.getCurrentNum = function() {
    return this.toothIter_ + 1;
  }

  ottermouth.Controller.prototype.setCurrentTooth_ = function(i) {
    this.toothIter_ = i;
    this.tooth = this.teeth[this.toothIter_];
  };

  ottermouth.Controller.prototype.next = function() {
    this.setCurrentTooth_(++this.toothIter_);
  };

  ottermouth.Controller.prototype.previous = function() {
    this.setCurrentTooth_(--this.toothIter_);
  };

  ottermouth.Controller.prototype.hasNext = function() {
    return this.toothIter_ < this.teeth.length - 1;
  };

  ottermouth.Controller.prototype.hasPrevious = function() {
    return this.toothIter_ > 0;
  };

  ottermouth.Controller.prototype.reset = function() {
    this.presentTeeth = {};
    this.toothIter_ = 0;
    this.tooth = this.teeth[this.toothIter_];
  };

  ottermouth.Controller.prototype.getRange = function() {
    var minimums = Object.getOwnPropertyNames(this.presentTeeth).map(function(toothId) {
      var tooth = this.toothIdMap_[toothId];
      var rangeKey = this.presentTeeth[toothId];
      return tooth[rangeKey].min;
    }, this);
    var maximums = Object.getOwnPropertyNames(this.presentTeeth).map(function(toothId) {
      var tooth = this.toothIdMap_[toothId];
      var rangeKey = this.presentTeeth[toothId];
      var maxRange =  tooth[rangeKey].max;
      console.log(rangeKey);
      console.log(maxRange);
      return maxRange
    }, this);
    return {
      min: Math.max.apply(null, minimums),
      max: Math.min.apply(null, maximums)
    };
  };

  ottermouth.omApp = function() {
    return {
      restrict: 'A',
      controller: 'omController',
      controllerAs: 'ctrl'
    };
  }

  ottermouth.omRangeButton = function() {
    return {
      restrict: 'E',
      require: '^omApp',
      scope: {
        tooth: '=',
        toothRange: '='
      },
      transclude: true,
      template:
          '<md-button ' +
          '    ng-disabled="!tooth[toothRange]"' + 
          '    ng-class="{\'md-raised\': omController.presentTeeth[tooth.id] == toothRange}"' +
          '    ng-click="omController.setTooth(tooth.id, toothRange)">' +
          '    <ng-transclude></ng-transclude>' + 
          '</md-button>',
      link: function(scope, element, attrs, omController) {
        scope.omController = omController;
      }
    }
  };

  var app = angular.module('ottermouth', ['ngMaterial']);
  app
      .controller('omController', [ottermouth.Controller])
      .directive('omApp', ottermouth.omApp)
      .directive('omRangeButton', ottermouth.omRangeButton);

  app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('brown')
        .accentPalette('cyan');
  });

})();