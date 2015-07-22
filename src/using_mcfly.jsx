var McFly = require('mcfly')
var Flux = new McFly()

// Action:
var TodoActions = Flux.createActions({
  create: function(text) {
    return {
      actionType: 'TODO_CREATE',
      text: text
    }
  }
})

// Store:
var _todos = {}
var create = function(text) {
  var id = Date.now()
  _todos[id] = {
    id: Date.now(),
    done: false,
    text: text
  }
}

var TodoStore = Flux.createStore({

  getAll: function() {
    return _todos
  }

  }, function(payload){

    switch(payload.actionType) {
      case 'TODO_CREATE':
        create(payload.text)
      break
      default:
        return true
    }

  TodoStore.emitChange()
  return true
})

// Components:
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