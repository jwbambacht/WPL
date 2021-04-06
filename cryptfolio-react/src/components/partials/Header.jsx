import React, { Component } from 'react';
import helpers from '../../utils/helper';
import { NavLink, Redirect } from 'react-router-dom';
import authservice from '../../services/authservice';
import * as UI from '../elements/UIElements';

export default class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
        };

        this.handleLogoutClick = this.handleLogoutClick.bind(this);

        this.setLoginState = this.setLoginState.bind(this);
    }

    handleLogoutClick() {
        this.props.handleLogout();
    }

    setLoginState(status) {
        this.setState({
            loggedIn: status,
        });
    }

    componentDidMount() {
        this.setLoginState(this.props.loggedIn);
    }

    componentDidUpdate(prevProps) {
        if (this.props.loggedIn != prevProps.loggedIn) {
            this.setLoginState(this.props.loggedIn);
        }
    }

    render() {
        return (
            <header>
                <nav className="navbar navbar-dark bg-dark navbar-expand-md">
                    <div className="container">
                        <NavLink exact to="/" className="navbar-brand px-2 d-none d-md-block">
                            <img src="./assets/images/cryptfolio.svg" width="auto" height="27px" />
                        </NavLink>

                        <NavLink exact to="/" className="navbar-brand px-2 d-md-none">
                            <img src="./assets/images/cryptfolio_long.svg" width="auto" height="27px" />
                        </NavLink>

                        <button
                            type="button"
                            data-bs-target="#navbarCollapse"
                            data-bs-toggle="collapse"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                            className="navbar-toggler collapsed"
                        >
                            <span className="navbar-toggle navbar-toggler-icon"></span>
                        </button>

                        <div id="navbarCollapse" className="collapse navbar-collapse">
                            <UI.List classes="navbar-nav me-auto mb-2 mb-lg-0">
                                <UI.NavListItem>
                                    <NavLink exact to="/" className="nav-link" activeClassName="active">
                                        Dashboard
                                    </NavLink>
                                </UI.NavListItem>
                                {this.state.loggedIn && (
                                    <UI.NavListItem>
                                        <NavLink exact to="/portfolios" className="nav-link" activeClassName="active">
                                            Portfolios
                                        </NavLink>
                                    </UI.NavListItem>
                                )}
                                <UI.NavListItem>
                                    <NavLink exact to="/watchlist" className="nav-link" activeClassName="active">
                                        Watchlist
                                    </NavLink>
                                </UI.NavListItem>
                                {authservice.admin() && (
                                    <UI.NavListItem>
                                        <NavLink exact to="/tokens" className="nav-link" activeClassName="active">
                                            Tokens
                                        </NavLink>
                                    </UI.NavListItem>
                                )}
                            </UI.List>
                            <UI.List classes="navbar-nav me-0 mb-2 mb-lg-0 pull-right">
                                {this.state.loggedIn ? (
                                    <>
                                        <UI.NavListItem>
                                            <NavLink exact to="/account" className="nav-link" activeClassName="active">
                                                Account
                                            </NavLink>
                                        </UI.NavListItem>
                                        <UI.NavListItem>
                                            <NavLink
                                                className="nav-link"
                                                activeClassName=""
                                                to="/"
                                                onClick={this.handleLogoutClick}
                                            >
                                                Logout
                                            </NavLink>
                                        </UI.NavListItem>
                                    </>
                                ) : (
                                    <>
                                        <UI.NavListItem>
                                            <NavLink to="/login" className="nav-link" activeClassName="active">
                                                Login
                                            </NavLink>
                                        </UI.NavListItem>
                                        <UI.NavListItem>
                                            <NavLink to="/register" className="nav-link" activeClassName="active">
                                                Register
                                            </NavLink>
                                        </UI.NavListItem>
                                    </>
                                )}
                            </UI.List>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}
