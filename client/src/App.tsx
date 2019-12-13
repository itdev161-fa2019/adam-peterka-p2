import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Create from "./components/Create/Create";
import View from "./components/View/View";

class App extends React.Component {
  state = {
    data: null,
    token: null,
    income: null,
    monthYear: null
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

    this.authenticateIncome();
  }

  authenticateIncome = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.removeItem("income");
      localStorage.removeItem("monthYear");
      this.setState({ income: null, weeklyIncome: null });
    }

    if (token) {
      const config = {
        headers: {
          "x-auth-token": token
        }
      };
      axios
        .get("http://localhost:5000/api/auth", config)
        .then(response => {
          localStorage.setItem("income", response.data.weeklyIncome);
          localStorage.setItem("monthYear", response.data.monthYear);
          this.setState({
            income: response.data.weeklyIncome,
            monthYear: response.data.monthYear
          });
        })
        .catch(error => {
          localStorage.removeItem("income");
          localStorage.removeItem("monthYear");
          this.setState({ income: null, weeklyIncome: null });
          console.error(`Error viewing in: ${error}`);
        });
    }
  };

  deleteIncome = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.removeItem("income");
      localStorage.removeItem("monthYear");
      this.setState({ income: null, weeklyIncome: null });
    }

    if (token) {
      const config = {
        headers: {
          "x-auth-token": token
        }
      };
      axios
        .delete("http://localhost:5000/api/delete", config)
        .then(response => {
          localStorage.removeItem("income");
          localStorage.removeItem("monthYear");
          localStorage.removeItem("token");
          this.setState({ income: null, monthYear: null, token: null });
          console.log(response);
        })
        .catch(error => {
          localStorage.removeItem("income");
          localStorage.removeItem("monthYear");
          this.setState({ income: null, monthYear: null });
          console.error(`Error finding in: ${error}`);
        });
    }
  };

  closeView = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("income");
    localStorage.removeItem("monthYear");
    this.setState({ income: null, monthYear: null, token: null });
  };

  render() {
    let { income, monthYear, data } = this.state;
    const authProps = {
      authenticateIncome: this.authenticateIncome,
      deleteIncome: this.deleteIncome
    };

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
                {income ? (
                  <Link to="" onClick={this.closeView}>
                    Close View
                  </Link>
                ) : (
                  <Link to="/view">View/Delete</Link>
                )}
              </li>
            </ul>
          </header>
          <main>
            <Route exact path="/">
              {income ? (
                <React.Fragment>
                  <div>Month and Year: {monthYear}.</div>
                  <div>Weekly Income: {income}</div>
                  <div>{data}</div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  Please Create a new Income or View an existing
                </React.Fragment>
              )}
            </Route>
            <Switch>
              <Route
                exact
                path="/create"
                render={() => <Create {...authProps} />}
              />
              <Route
                exact
                path="/view"
                render={() => <View {...authProps} />}
              />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
