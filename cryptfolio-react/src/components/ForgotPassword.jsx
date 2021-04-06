import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import helper from '../utils/helper';
import authservice from '../services/authservice';
import userservice from '../services/userservice';
import * as UI from './elements/UIElements';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            password_confirmation: '',
            forgotErrors: [],
            forgotSuccess: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.handleErrors = this.handleErrors.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
    }

    handleChange(e) {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value,
        });
    }

    handleErrors(errors) {
        if (errors.length != 0) {
            this.setState({
                ...this.state,
                forgotErrors: errors.map(function (error) {
                    return error.error;
                }),
                forgotSuccess: '',
            });
        }
    }

    handleSuccess(message) {
        this.setState({
            ...this.state,
            forgotSuccess: message,
            forgotErrors: [],
        });
    }

    validateForm() {
        return (
            this.state.username.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password_confirmation.length > 0
        );
    }

    handleClick(e) {
        e.preventDefault();

        if (!(this.state.username && this.state.password && this.state.password_confirmation)) {
            return;
        }

        console.log(this.state);

        userservice.forgotPassword(
            this.state.username,
            this.state.password,
            this.state.password_confirmation,
            this.handleErrors,
            this.handleSuccess,
        );
    }

    render() {
        return (
            <UI.Row classes="mt-4">
                <UI.Col classes="col-12 col-md-6 offset-md-3">
                    <UI.Card>
                        <UI.CardHeader>
                            <UI.CardHeaderTitle>Forgot Password</UI.CardHeaderTitle>
                            <div className="fs-6 text-muted">
                                Please fill in your username and choose a new password.
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
                                        value={this.state.username}
                                        onChange={this.handleChange}
                                        classes="btn-dark w-100"
                                    />
                                </UI.FormColInput>
                            </UI.FormRow>
                            <UI.FormRow>
                                <UI.FormColLabel>
                                    <UI.FormLabel>New Password</UI.FormLabel>
                                </UI.FormColLabel>
                                <UI.FormColInput>
                                    <UI.Input
                                        type="password"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                        classes="btn-dark w-100"
                                    />
                                </UI.FormColInput>
                            </UI.FormRow>
                            <UI.FormRow>
                                <UI.FormColLabel>
                                    <UI.FormLabel>Repeat Password</UI.FormLabel>
                                </UI.FormColLabel>
                                <UI.FormColInput>
                                    <UI.Input
                                        type="password"
                                        name="password_confirmation"
                                        value={this.state.password_confirmation}
                                        onChange={this.handleChange}
                                        classes="btn-dark w-100"
                                    />
                                </UI.FormColInput>
                            </UI.FormRow>

                            <UI.FormRow>
                                <UI.FormColInput classes="offset-md-4">
                                    <div className="form-text text-danger fs-7 fst-italic">
                                        {this.state.forgotErrors.map((error) => (
                                            <div key={error}>{error}</div>
                                        ))}
                                    </div>
                                    <div className="form-text text-success fs-7 fst-italic">
                                        {this.state.forgotSuccess}
                                    </div>
                                </UI.FormColInput>
                            </UI.FormRow>

                            <UI.FormRow>
                                <UI.FormColInput classes="offset-md-4">
                                    <NavLink exact to="/login" className="btn btn-sm btn-dark float-start">
                                        Back to Login page
                                    </NavLink>
                                    <button
                                        className="btn btn-sm btn-success float-end"
                                        disabled={!this.validateForm()}
                                        onClick={(event) => this.handleClick(event)}
                                    >
                                        Reset Password
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
