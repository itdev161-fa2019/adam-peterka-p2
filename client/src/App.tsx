import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Create from "./components/Create/Create";
import View from "./components/View/View";
import BillList from "./components/BillList/BillList";
import Bill from "./components/Bill/Bill";

class App extends React.Component {
  state = {
    bills: [],
    bill: null,
    token: null,
    income: null,
    monthYear: null
  };

  componentDidMount() {
    this.authenticateIncome();
  }

  authenticateIncome = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.removeItem("income");
      localStorage.removeItem("monthYear");
      this.setState({ income: null, monthYear: null });
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
          this.setState(
            {
              income: response.data.weeklyIncome,
              monthYear: response.data.monthYear,
              token: token
            },
            () => {
              this.loadData();
            }
          );
        })
        .catch(error => {
          localStorage.removeItem("income");
          localStorage.removeItem("monthYear");
          this.setState({ income: null, monthYear: null });
          console.error(`Error viewing in: ${error}`);
        });
    }
  };

  loadData = () => {
    const { token } = this.state;

    if (token) {
      const config = {
        headers: {
          "x-auth-token": token
        }
      };
      axios
        .get("http://localhost:5000/api/bills", config)
        .then(response => {
          this.setState({
            bills: response.data
          });
        })
        .catch(error => {
          console.error(`Error fetching data: ${error}`);
        });
    }
  };

  viewBill = bill => {
    console.log(`view ${bill.name}`);
    this.setState({
      bill: bill
    });
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

  deleteBill = bill => {
    const { token } = this.state;

    if (token) {
      const config = {
        headers: {
          "x-auth-token": token
        }
      };

      axios
        .delete(`http://localhost:5000/api/bills/${bill._id}`, config)
        .then(response => {
          const newBills = this.state.bills.filter(b => b._id !== bill._id);
          this.setState({
            bills: [...newBills]
          });
        })
        .catch(error => {
          console.error(`Error deleting post: ${error}`);
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
    let { income, monthYear, bills, bill } = this.state;
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
            <Switch>
              <Route exact path="/">
                {income ? (
                  <React.Fragment>
                    <div>Month and Year: {monthYear}</div>
                    <div>Weekly Income: {income}</div>
                    <BillList
                      bills={bills}
                      clickBill={this.viewBill}
                      deleteBill={this.deleteBill}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    Please Create a new Income or View an existing
                  </React.Fragment>
                )}
              </Route>
              <Route path="/bills/:billId">
                <Bill bill={bill} />
              </Route>
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
