var assign = require('object-assign')

// Dispatcher
var Dispatcher = require('flux').Dispatcher
var AppDispatcher = assign(new Dispatcher(), {
  handleViewAction: function(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    })
  }
})

// Store
var EventEmitter = require('events').EventEmitter
var _todos = {}
var create = function(text) {
  return {
    id: Date.now(),
    done: false,
    text: text
  }
}
var destroy = function(id) {
  delete _todos[id]
}
var CHANGE_EVENT = 'change'
var TodoStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _todos
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT)
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback)
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action
    var text

    switch(action.actionType) {

      case 'TODO_CREATE':
        text = action.text.trim()
        if (text !== '') {
          create(text)
          TodoStore.emitChange()
        }
        break

      case 'TODO_DESTROY':
        destroy(action.id)
        TodoStore.emitChange()
        break
    }

    return true
  })
})

// Components
var React = require('react')
var Ryan = React.createClass({
  render: function() {
    return <div><p>hi</p></div>
  }
})

var element = React.createElement(Ryan, {})
React.render(element, document.querySelector('.container'))
