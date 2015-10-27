angular.module('fasterAngular', [])
    .controller('mycontroller', [function () {
        var self = this;
        self.framework = 'ReactJs';
        self.data = [];
        // Fill the data map with random data
        self.refresh = function () {
            for (var i = 0; i < 1500; ++i) {
                self.data[i] = {};
                for (var j = 0; j < 5; ++j) {
                    self.data[i][j] = Math.random();
                }
            }
        }
        self.refresh()
    }])

    .directive('reactDisplay', ['tableDOMService', function (tableDOMService) {
        var self = {};
        self.link = function(scope, el, attrs){
            scope.$watchCollection('data', function(newValue, oldValue){
                var tableDOMClass = tableDOMService.create();
                var element = React.createElement(tableDOMClass, {data:newValue});
                React.render(
                    element, el[0]
                );
            })
        };
        return{
            restrict: 'E',
            scope:{
                data: '='
            },
            link: self.link
        }
    }])

    .service('tableDOMService', function () {
        var self = this;
        self.render = function () {
            var data = this.props.data;

            var rows = data.map(function (datum) {
                var clickHandler = function (ev) {
                    console.log('in ReactJS');
                    console.log(ev);
                };

                return (
                    React.DOM.tr( {onClick:clickHandler},
                        React.DOM.td(null, datum['0']),
                        React.DOM.td(null, datum['1']),
                        React.DOM.td(null, datum['2']),
                        React.DOM.td(null, datum['3']),
                        React.DOM.td(null, datum['4'])
                    )
                );
            });

            return (
                React.DOM.table(null, rows)
            );
        };

        self.create = function () {
            return React.createClass({
                displayName: 'MyList',
                render: self.render
            });
        }
    })