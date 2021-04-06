import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../Dashboard';
import Login from '../Login';
import Register from '../Register';
import Preferences from '../Preferences';
import Admin from '../Admin';
import helpers from '../../utils/helper';
import PrivateRoute from '../../PrivateRoute';

export default class Main extends Component {
    constructor(props) {
        super(props);
    }

    //     this.state = {
    //         email: '',
    //         password: '',
    //     };

    //     this.handleSubmit = this.handleSubmit.bind(this);
    //     this.handleChange = this.handleChange.bind(this);
    // }

    // handleChange(event) {
    //     console.log('On change event', event);
    //     this.setState({
    //         [event.target.name]: event.target.value,
    //     });
    // }

    // handleSubmit(event) {
    //     event.preventDefault();
    //     console.log('test');
    // }

    // <form onSubmit={this.handleSubmit}>
    //     <input type="text" name="email" value={this.state.email} onChange={this.handleChange} required />
    //     <input
    //         type="password"
    //         name="password"
    //         value={this.state.password}
    //         onChange={this.handleChange}
    //         required
    //     />
    //     <button type="submit">Submit</button>
    // </form>

    render() {
        return (
            <main className="container pb-5">
                <div className="row mt-4">
                    <Switch>
                        <Route
                            exact
                            path={'/'}
                            render={(props) => <Preferences {...props} loggedIn={props.loggedIn} />}
                        />

                        <Route exact path="/dashboard" component={Dashboard} />
                        <Route exact path="/preferences" component={Preferences} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Register} />
                    </Switch>
                </div>
            </main>
        );
    }
}
