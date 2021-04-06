import React, { useState, Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import authservice from '../services/authservice';
import helper from '../utils/helper';
import * as UI from './elements/UIElements';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            remember_me: false,
            loginErrors: [],
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleErrors(errors) {
        if (errors.length != 0) {
            this.setState({
                loginErrors: errors.map(function (error) {
                    return error.error;
                }),
            });
        }
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!(this.state.username && this.state.password)) {
            return;
        }

        if (
            authservice.login(
                this.state.username,
                this.state.password,
                this.state.remember_me,
                this.props.handleLogin,
                this.handleErrors,
            )
        ) {
            setTimeout(() => {
                this.props.history.push('/');
            }, 500);
        }
    }

    render() {
        return (
            <UI.Row classes="mt-4">
                <UI.Col classes="col-12 col-md-6 offset-md-3">
                    <UI.Card>
                        <UI.CardHeader>
                            <UI.CardHeaderTitle>Login</UI.CardHeaderTitle>
                            <div className="fs-6 text-muted">Please fill in your credentials below to login.</div>
                        </UI.CardHeader>
                        <UI.CardBody>
                            <form onSubmit={this.handleSubmit}>
                                <UI.FormRow>
                                    <UI.FormColLabel>
                                        <UI.FormLabel>Username</UI.FormLabel>
                                    </UI.FormColLabel>
                                    <UI.FormColInput>
                                        <UI.Input
                                            type="text"
                                            name="username"
                                            autoFocus
                                            classes="btn-dark w-100"
                                            value={this.state.username}
                                            onChange={this.handleChange}
                                        />
                                    </UI.FormColInput>
                                </UI.FormRow>
                                <UI.FormRow>
                                    <div className="col-12 col-md-8 offset-md-4"></div>
                                </UI.FormRow>
                                <UI.FormRow>
                                    <UI.FormColLabel>
                                        <label className="col-form-label text-white fst-italic fw-bold">Password</label>
                                    </UI.FormColLabel>
                                    <UI.FormColInput>
                                        <UI.Input
                                            type="password"
                                            name="password"
                                            classes="btn-dark w-100"
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                        />
                                    </UI.FormColInput>
                                </UI.FormRow>
                                <UI.FormRow>
                                    <div className="col-12 col-md-8 offset-md-4"></div>
                                </UI.FormRow>
                                <UI.FormRow>
                                    <UI.FormColInput classes="offset-md-4 d-flex justify-content-between align-items-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                type="checkbox"
                                                name="remember_me"
                                                className="form-check-input"
                                                checked={this.state.remember_me}
                                                onChange={(e) => {
                                                    this.handleChange({
                                                        target: {
                                                            name: e.target.name,
                                                            value: e.target.checked,
                                                        },
                                                    });
                                                }}
                                            />
                                            <label className="form-check-label">Remember me</label>
                                        </div>
                                        <NavLink exact to="/forgotPassword" className="fs-7 text-muted">
                                            Forgot password?
                                        </NavLink>
                                    </UI.FormColInput>
                                </UI.FormRow>
                                <UI.FormRow>
                                    <UI.FormColInput classes="offset-md-4">
                                        <div className="form-text text-danger fs-7 fst-italic">
                                            {this.state.loginErrors.map((error) => (
                                                <div key={error}>{error}</div>
                                            ))}
                                        </div>
                                    </UI.FormColInput>
                                </UI.FormRow>
                                <UI.FormRow>
                                    <UI.FormColInput classes="offset-md-4">
                                        <NavLink exact to="/register" className="btn btn-sm btn-dark float-start">
                                            Go to Register page
                                        </NavLink>
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-success float-end"
                                            disabled={!this.validateForm()}
                                        >
                                            Login
                                        </button>
                                    </UI.FormColInput>
                                </UI.FormRow>
                            </form>
                        </UI.CardBody>
                    </UI.Card>
                </UI.Col>
            </UI.Row>
        );
    }
}
