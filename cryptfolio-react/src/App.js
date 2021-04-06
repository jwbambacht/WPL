import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

// Partial page templates
import Header from './components/partials/Header';
import Footer from './components/partials/Footer';

// Pages
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ActivateAccount from './components/ActivateAccount';
import ForgotPassword from './components/ForgotPassword';
import Account from './components/Account';
import Portfolios from './components/Portfolios';
import PortfolioView from './components/PortfolioView';
import PortfolioEdit from './components/PortfolioEdit';
import Asset from './components/Asset';
import Watchlist from './components/Watchlist';
import Tokens from './components/Tokens';
import Error from './components/Error';

// Helper functions
import helper from './utils/helper';

// Service
import authservice from './services/authservice';

// Styling includes
import './App.css';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: false,
        };

        this.baseState = this.state;

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogin(data) {
        setTimeout(() => {
            this.setState({
                login: true,
            });
        }, 500);
    }

    handleLogout() {
        if (authservice.logout()) {
            this.state = this.baseState;
        }
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            login: authservice.loggedIn(),
        });
    }

    render() {
        return (
            <Router>
                <Header loggedIn={this.state.login} handleLogout={this.handleLogout} />
                <main className="container pb-5">
                    <Switch>
                        <>
                            <Route
                                exact
                                path={'/'}
                                render={(props) => <Dashboard {...props} loggedIn={this.state.login} />}
                            />

                            <Route
                                exact
                                path={'/login'}
                                render={(props) =>
                                    !this.state.login ? (
                                        <Login {...props} handleLogin={this.handleLogin} />
                                    ) : (
                                        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                                    )
                                }
                            />

                            <Route
                                exact
                                path={'/register'}
                                render={(props) =>
                                    !this.state.login ? (
                                        <Register {...props} />
                                    ) : (
                                        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                                    )
                                }
                            />

                            <Route
                                exact
                                path={'/activateAccount/:id?'}
                                render={(props) =>
                                    !this.state.login ? (
                                        <ActivateAccount {...props} />
                                    ) : (
                                        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                                    )
                                }
                            />

                            <Route
                                exact
                                path={'/forgotPassword'}
                                render={(props) =>
                                    !this.state.login ? (
                                        <ForgotPassword {...props} />
                                    ) : (
                                        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                                    )
                                }
                            />

                            <Route
                                exact
                                path={'/portfolios'}
                                render={(props) => <Portfolios {...props} loggedIn={this.state.login} />}
                            />

                            <Route
                                exact
                                path={'/portfolio/edit/:id'}
                                render={(props) => <PortfolioEdit {...props} loggedIn={this.state.login} />}
                            />

                            <Route
                                exact
                                path={'/portfolio/view/:id'}
                                render={(props) => <PortfolioView {...props} loggedIn={this.state.login} />}
                            />

                            <Route
                                exact
                                path={'/asset/:id'}
                                render={(props) => <Asset {...props} loggedIn={this.state.login} />}
                            />

                            <Route
                                exact
                                path={'/watchlist'}
                                render={(props) => <Watchlist {...props} loggedIn={this.state.login} />}
                            />

                            <Route
                                exact
                                path={'/tokens'}
                                render={(props) => <Tokens {...props} loggedIn={this.state.login} />}
                            />

                            <Route
                                exact
                                path={'/account'}
                                render={(props) => <Account {...props} loggedIn={this.state.login} />}
                            />

                            <Route
                                exact
                                path={'/error'}
                                render={(props) => <Error {...props} loggedIn={this.state.login} />}
                            />
                        </>
                    </Switch>
                </main>
                <Footer />
            </Router>
        );
    }
}
