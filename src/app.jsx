var assign = require('object-assign')

// Actions:
var TodoActions = {
  create: function(text) {
    AppDispatcher.handleViewAction({
      actionType: 'TODO_CREATE',
      text: text
    })
  }
}

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
var _todos = {
  1: {id: 1, done: false, text: 'Number one'},
  2: {id: 2, done: false, text: 'Number two'}
}
var create = function(text) {
  var id = Date.now()
  _todos[id] = {
    id: Date.now(),
    done: false,
    text: text
  }
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
    }

    return true
  })
})

// Components
var getTodoState = function() {
  return {
    allTodos: TodoStore.getAll()
  }
}


var React = require('react')
var TodoApp = React.createClass({
  getInitialState: function() {
    return getTodoState()
  },
  componentDidMount: function() {
    TodoStore.addChangeListener(this._onChange)
  },
  componentWillUnmount: function() {
    TodoStore.removeChangeListener(this._onChange)
  },
  render: function() {
    return <div>
      <Header />
      <List allTodos={this.state.allTodos}/>
          </div>
  },
  _onChange: function() {
    this.setState(getTodoState())
  }
})

var Header = React.createClass({
  getInitialState: function() {
    return {
      text: ''
    }
  },
  
  handleInputChange: function(event) {
    this.setState({text: event.target.value})
  },
  
  render: function() {
    return (
    <div className="input-group">
      <input
        style={{margin: 5}}
        value={this.state.text}
        onChange={this.handleInputChange}
        type="text"
        className="form-control"
      />
      <span className="input-group-btn">
        <button
          onClick={this.handleClick}
          className="btn btn-default"
          type="button">
          Add
        </button>
      </span>
    </div>
        )
  },
  
  handleClick: function() {
    TodoActions.create(this.state.text)
  }
})

var List = React.createClass({
  render: function() {
    var allTodos = this.props.allTodos
    var todos = []
    for (var key in allTodos) {
      todos.push(<TodoItem key={key} todo={allTodos[key]} />)
    }
    return (
      <section id="main">
          <ul id="todo-list">{todos}</ul>
      </section>
    )
  }
})

var TodoItem = React.createClass({
  render: function() {
    var todo = this.props.todo
    return <li>{todo.text}</li>
  }
})

var element = React.createElement(TodoApp, {})
React.render(element, document.querySelector('.container'))
