import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Create from "./components/Create/Create";
import View from "./components/View/View";

class App extends React.Component {
  state = {
    data: null
  };

  componentDidMount() {
    axios
      .get("http://localhost:5000")
      .then(response => {
        this.setState({
          data: response.data
        });
      })
      .catch(error => {
        console.error(`Error fetching data: ${error}`);
      });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>Expenses App</h1>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/create">Create New</Link>
              </li>
              <li>
                <Link to="/view">View</Link>
              </li>
            </ul>
          </header>
          <main>
            <Route exact path="/">
              {this.state.data}
            </Route>
            <Switch>
              <Route exact path="/create" component={Create} />
              <Route exact path="/view" component={View} />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
