'use strict';

var _ = require('lodash');
var angular = require('angular');
var Hammer = require('hammerjs');

require('./marking-tools.module.js')
    .factory('textTool', textTool);

// @ngInject
function textTool($rootScope, $timeout, Annotations, toolUtils) {

    $rootScope.$on('markingTools:disable', _disable);
    $rootScope.$on('markingTools:enable', _enable);

    var factory;
    var _panzoom;
    var _enabled;
    var _svg;

    factory = {
        name: 'text',
        activate: activate,
        deactivate: deactivate
    };

    return factory;


    function activate(svg) {
        _svg = svg;
        _panzoom = new Hammer(svg.find('.pan-zoom')[0]);
        _panzoom.on('tap', _clickHandler);
        _enabled = true;
    }

    function deactivate() {
        var incomplete = _isLastAnnotationIncomplete();
        if (incomplete) {
            Annotations.destroy(incomplete);
        }
        _panzoom.off('tap', _clickHandler);
    }

    function _clickHandler(event) {
        if (_enabled && _isAllowedTarget(event)) {
           
                _markWord(event);
        }
    }

    function _disable() {
        _enabled = false;
    }

    function _enable() {
        function setEnabled() {
            _enabled = true;
        }
        $timeout(setEnabled);
    }

    /*function _endLine(event, annotation) {
        var point = _getPoint(event);
        Annotations.upsert(_.extend(annotation, {
            complete: true,
            endPoint: {
                x: point.x,
                y: point.y
            }
        }));
        $rootScope.$apply();
    }*/

    function _getPoint(event) {
        return toolUtils.getPoint(_svg, event.srcEvent);
    }

    function _isAllowedTarget(event) {
        var element = angular.element(event.target);
        return element.parents('.text-annotation').length === 0;
    }

    function _isLastAnnotationIncomplete() {
        var last = _.filter(Annotations.list(), { type: 'text' }).slice(-1)[0];
        return (_.isUndefined(last) || last.complete) ? false : last;
    }

    function _markWord(event) {
        var point = _getPoint(event);
        Annotations.upsert({
            
            pointCoords: {
                x: point.x,
                y: point.y
            }
        });
        $rootScope.$apply();
    }

}
