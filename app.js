'use strict';

var wikiTestData;
var wikiData;

angular.module('fullsailTest', [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'ui.bootstrap'
])
.config(['$routeProvider', function($routeProvider) {}])
// .run(function($http){
//   $http.get("discussion.json").success(function(data){ // get that data
//     wikiTestData = data;
//   });
// })
.factory('wikiTestDataGet', ['$resource',
  function($resource){
    return $resource('discussion.json', {}, { query: { method:'GET' } });
  }
])
.controller('ApplicationCtrl', 
  ['$scope',
  function($scope) {

    $scope.oneAtATime = true;

    $scope.aofs = [
      {
        title: 'Area of Focus',
        content: "Choose which element you want a specialty in to progress further in your path as a mage. Each element has its own unique aspects to allow you to choose a Paragon path as you become more powerful"
      },
      {
        title: 'Music Arrangement',
        content: 'This course focuses on developing an understanding of the nature and limitations of acoustic and electronic instruments, as well as effective formulaic techniques for successful arrangement.'
      },
      {
        title: 'Digital Recording Principles',
        content: 'In the Digital Recording Priciples Course, students receive training on how to get professional-sounding results from their laptop-based project studio environment.'
      }
    ];

    $scope.myInterval = 5000;
    $scope.slides = [
      {
        title: 'Your Mac Laptop',
        subtitle:'Project Launchbox™*',
        img: 'macbook',
        content: [
          {text:'Learn and create from anywhere'},
          {text:'Features powerful media creation software'},
          {text:'Allows for a media-rich learning experience'}
        ]
      },
      {
        title: 'Connect & Collaborate',
        img: 'connect',
        content: [
          {text:"Network with classmates online"},
          {text:"One-click access to instructors"},
          {text:"Video conferencing"},
          {text:"Technical support provided 8 a.m. - 2 a.m. E.S.T., 7 days a week"},
        ]
      },
      {
        title: 'Engaging Media-Rich Curriculum',
        img: 'media_rich',
        content: [
          {text:'Video presentations'},
          {text:'Animations and interactive content'},
          {text:'Online guest lectures and interviews'},
          {text:'Course Director podcasts'}
        ]
      }
    ];
   $scope.$watch('active', function(active) {
    if (active) {
      console.log('trigger')
      carouselCtrl.select($scope);
    }
  });
    
}])
.factory('FormatJSON', 
  [ '$filter', '$timeout',
  function ($filter, $timeout) {
    return {
      config: function(object) {
        var topics = object.topics;
        // Create an array based on number of topics
        var allTopics = Array.apply(null, new Array(topics.length));
        for (var t = 0; t < topics.length; t++) {
         
          //  Easy function to grab the deepest depth interger
          var dep = getDepth(topics[t].responses);

          // Loop through for each depth
          while ( dep > 0 ){
            // Create array of all response objects that match the current depth
            var lowDepths = _.where(topics[t].responses, {depth: dep});
            // Group the responses into and object of arrays with the parentids as keys
            var chdObjs = _.groupBy(lowDepths,'parentid');

            // Loop for each parentid
            for(var parentid in chdObjs){
              // Grab the reponse object with the matching id
              var prtObjt = _.findWhere(topics[t].responses, {id: parseInt(parentid)});
              // Magic.
              prtObjt.responses = chdObjs[parentid];
            }
            // get one level higher
            dep--
          }
          // If childless response is undefined, move the single reponse to the prtObjt
          if (_.isUndefined(prtObjt)) {prtObjt = _.findWhere(topics[t].responses, {parentid: 0});};

          // A object to hold each topic and conversations
          var topicObj = {
            topictitle: topics[t].topictitle,
            responses: [prtObjt]
          }

          // 
          allTopics[t] = topicObj;         
        }
        return allTopics;
      }
    }
  }
])
.filter('formatDatetime', function($rootScope, $filter) {
  return function (value) {
    // Get now
    var now = (new Date).getTime();
    // subtract value from now as seconds
    var ago = now - value;
    // return fitered time format
    return $filter('date')(ago, 'medium');
  };
})

function getDepth(object){
  var d = 0;
  for (var r = 0; r < object.length; r++) {
    if (object[r].depth > d) {d = object[r].depth};
  }
  return d;
}
