import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }


  componentDidMount() {
    fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(data => this.setState({users: data}));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <form action="/login" method="POST">

          </form>

          <ul>
            {this.state.users.map((user) => {
              return <li key={user.id}>{user.id} {user.name}</li>;
            })}
          </ul>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }

}

export default App;
