var React = require('react');

class MyEmpTable extends React.CSSComponent {
    render() {

    }
}


var myEmpReactClass = React.createClass({
    displayName: 'MyEmployeesList',
    render: function () {
        var employees = this.props.employees;

        var styles = {
            table: {
                border: "1px solid #dfd7ca",
                color: '#3e3f3a',
                background: '#b3d4fc',
                'borderBottomWidth': '2px',
                'borderCollapse': 'collapse',
                'width': '90%'
            },
            td: {
                border: '1px solid #999',
                padding: '8px',
                'width': '18%'
            }
        };

        var rows = employees.map(function (emp) {
            var clickHandler = function (ev) {
                console.log('in ReactJS');
                console.log(ev);
                console.log(ev.target.attributes);
            };

            return (
                React.DOM.tr({onClick: clickHandler},
                    React.DOM.td({style: styles.td}, emp.id),
                    React.DOM.td({style: styles.td}, emp.name),
                    React.DOM.td({style: styles.td}, emp.salary),
                    React.DOM.td({style: styles.td}, emp.department.name)
                )
            );
        });

        return (
            React.DOM.table({style: styles.table},
                React.DOM.tbody(null,rows))
        );
    }
});