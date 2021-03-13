import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Token from '../../token';
import Dashboard from '../Dashboard';
import Login from '../Login';
import Logout from '../Logout';
import Preferences from '../Preferences';
import helpers from '../../utils/helper';

function Main() {
    const { token, setToken } = Token();

    return (
        <main className="container pb-5">
            <div className="row mt-4">
                {!token ? (
                    <Login setToken={setToken} />
                ) : (
                    <BrowserRouter>
                        <Switch>
                            <Route path="/dashboard">
                                <Dashboard />
                            </Route>
                            <Route path="/preferences">
                                <Preferences />
                            </Route>
                            <Route path="/logout">
                                <Logout />
                            </Route>
                        </Switch>
                    </BrowserRouter>
                )}
            </div>
        </main>
    );
}

export default Main;
