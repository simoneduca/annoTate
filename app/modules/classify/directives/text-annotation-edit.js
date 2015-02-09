(function (angular) {

    'use strict';

    var module = angular.module('transcribe');

    module.directive('textAnnotationEdit', [
        '$window',
        function ($window) {
            return {
                scope: {
                    data: '='
                },
                restrict: 'A',
                replace: true,
                templateUrl: 'classify/templates/directives/text-annotation-edit.html',
                link: function (scope, element, attrs) {

                    var ClassifyCtrl = scope.$parent.$parent;
                    var viewport = element.parent();
                    var textArea = element.find('textarea');

                    scope.translateX = 0;
                    scope.translateY = 0;
                    scope.text = scope.data.text || '';

                    var tag = function (tagText) {

                        var startTag = '[' + tagText + ']';
                        var endTag = '[/' + tagText + ']';

                        var start = textArea.prop('selectionStart');
                        var end = textArea.prop('selectionEnd');
                        var text = textArea.val();

                        if (start === end) {
                            var textBefore = text.substring(0, start);
                            var textAfter = text.substring(start, text.length);
                            textArea.val(textBefore + startTag + endTag + textAfter);
                        } else {
                            var textBefore = text.substring(0, start);
                            var textInBetween = text.substring(start, end);
                            var textAfter = text.substring(end, text.length);
                            textArea.val(textBefore + startTag + textInBetween + endTag + textAfter);
                        }

                        textArea[0].focus();

                    };

                    scope.startDrag = function ($event) {
                        var target = $event.target.tagName;
                        if (target === 'DIV' && $event.button === 0) {
                            element.addClass('dragging');
                            $event.preventDefault();
                            viewport.on('mousemove', drag);
                        }

                    };

                    var drag = function (event) {
                        event.preventDefault();
                        scope.translateX += event.movementX;
                        scope.translateY += event.movementY;
                        element.css('transform', 'translateX(' + scope.translateX + 'px) translateY(' + scope.translateY + 'px)');
                    };

                    scope.endDrag = function ($event) {
                        var target = $event.target.tagName;
                        if (target === 'DIV') {
                            element.removeClass('dragging');
                            viewport.off('mousemove');
                        }
                    };

                    scope.deletion = function ($event) {
                        tag('deletion');
                    };

                    scope.insertion = function ($event) {
                        tag('insertion');
                    };

                    scope.illegible = function ($event) {
                        tag('illegible');
                    };

                    scope.close = function () {
                        ClassifyCtrl.editingTextAnnotation = null;
                    };

                    scope.save = function () {
                        scope.data.text = scope.text;
                        scope.close();
                    };

                }
            }
        }
    ]);

}(window.angular));