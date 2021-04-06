import React, { useState, Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import authservice from '../services/authservice';
import helper from '../utils/helper';
import * as UI from './elements/UIElements';

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                username: '',
                password: '',
                password_confirmation: '',
                email: '',
            },
            registrationErrors: [],
            registrationSuccess: '',
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
    }

    handleChange(e) {
        this.setState({
            user: {
                ...this.state.user,
                [e.target.name]: e.target.value,
            },
        });
    }

    handleErrors(errors) {
        if (errors.length != 0) {
            this.setState({
                ...this.state,
                registrationErrors: errors.map(function (error) {
                    return error.error;
                }),
                registrationSuccess: '',
            });
        }
    }

    handleSuccess(message) {
        this.setState({
            ...this.state,
            registrationSuccess: message,
            registrationErrors: [],
        });
    }

    validateForm() {
        return (
            this.state.user.username.length > 0 &&
            this.state.user.email.length > 0 &&
            this.state.user.password.length > 0 &&
            this.state.user.password_confirmation.length > 0
        );
    }

    handleClick(e) {
        e.preventDefault();

        if (!(this.state.user.username && this.state.user.password && this.state.user.password_confirmation)) {
            return;
        }

        authservice.register(this.state.user, this.handleSuccess, this.handleErrors);
    }

    render() {
        return (
            <UI.Row classes="mt-4">
                <UI.Col classes="col-12 col-md-6 offset-md-3">
                    <UI.Card>
                        <UI.CardHeader>
                            <UI.CardHeaderTitle>Register</UI.CardHeaderTitle>
                            <div className="fs-6 text-muted">
                                Please fill in the details below to create your account.
                            </div>
                        </UI.CardHeader>
                        <UI.CardBody>
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
                                <UI.FormColLabel>
                                    <UI.FormLabel>Email</UI.FormLabel>
                                </UI.FormColLabel>
                                <UI.FormColInput>
                                    <UI.Input
                                        type="text"
                                        name="email"
                                        classes="btn-dark w-100"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    />
                                </UI.FormColInput>
                            </UI.FormRow>
                            <UI.FormRow>
                                <UI.FormColLabel>
                                    <UI.FormLabel>Password</UI.FormLabel>
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
                                <UI.FormColLabel>
                                    <UI.FormLabel>Password Confirmation</UI.FormLabel>
                                </UI.FormColLabel>
                                <UI.FormColInput>
                                    <UI.Input
                                        type="password"
                                        name="password_confirmation"
                                        classes="btn-dark w-100"
                                        value={this.state.password_confirmation}
                                        onChange={this.handleChange}
                                    />
                                </UI.FormColInput>
                            </UI.FormRow>

                            <UI.FormRow classes="text-danger fst-italic">
                                <UI.FormColInput classes="offset-md-4">
                                    <div className="form-text text-danger fs-7 fst-italic">
                                        {this.state.registrationErrors.map((error) => (
                                            <div>{error}</div>
                                        ))}
                                    </div>
                                </UI.FormColInput>
                                <UI.FormColInput classes="offset-md-4">
                                    <div className="form-text text-success fs-7 fst-italic">
                                        {this.state.registrationSuccess}
                                    </div>
                                </UI.FormColInput>
                            </UI.FormRow>

                            <UI.FormRow>
                                <UI.FormColInput classes="offset-md-4">
                                    <NavLink exact to="/login" className="btn btn-sm btn-dark float-start">
                                        Go to Login page
                                    </NavLink>
                                    <button
                                        type="submit"
                                        className="btn btn-sm btn-success float-end"
                                        disabled={!this.validateForm()}
                                        onClick={(event) => this.handleClick(event)}
                                    >
                                        Register
                                    </button>
                                </UI.FormColInput>
                            </UI.FormRow>
                        </UI.CardBody>
                    </UI.Card>
                </UI.Col>
            </UI.Row>
        );
    }
}
