var React = require('react')

var Ryan = React.createClass({
  render: function() {
    return <p>Hi</p>
  }
})

var element = React.createElement(Ryan, {})
React.render(element, document.querySelector('.container'))
