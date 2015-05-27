'use strict';

require('./subjects.module.js')
    .factory('subjectsFactory', subjectsFactory);

// @ngInject
function subjectsFactory($q, $timeout) {

    var factory;

    factory = {
        get: getDummy
    };

    return factory;

    function getDummy() {
        return $timeout(function () {
            return {
                height: '2500',
                url: 'images/TGA_8812_1_3_2036_1.jpg',
                width: '1648'
            };
        }, 2000);
    }

    //    function preloadImage(subject) {
    //
    //        var deferred = $q.defer();
    //
    //        subject.image = new Image();
    //        //        subject.image.src = subject.locations[0]['image/jpeg'];
    //        subject.image.url = 'images/TGA_8812_1_3_2036_1.jpg'
    //        subject.image.onload = function () {
    //            deferred.resolve(subject);
    //        };
    //
    //        return deferred.promise;
    //
    //    };

}
