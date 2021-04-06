import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import helper from '../utils/helper';
import userservice from '../services/userservice';
import * as UI from './elements/UIElements';

export default class ActivateAccount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authToken: this.props.match.params.id || '',
            activateErrors: [],
            activateSuccess: '',
            activated: false,
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
                activateErrors: errors.map(function (error) {
                    return error.error;
                }),
                activateSuccess: '',
            });
        }
    }

    handleSuccess(message) {
        this.setState({
            ...this.state,
            activateSuccess: message,
            activateErrors: [],
            activated: true,
        });
    }

    validateForm() {
        return this.state.authToken.length > 0;
    }

    handleClick(e) {
        e.preventDefault();

        if (!this.state.authToken) {
            return;
        }

        userservice.activateAccount(this.state.authToken, this.handleErrors, this.handleSuccess);
    }

    render() {
        return (
            <UI.Row classes="mt-4">
                <UI.Col classes="col-12 col-md-6 offset-md-3">
                    <UI.Card>
                        {!this.state.activated && (
                            <div className="card-header bg-lighter fs-3">
                                <div className="fw-bold">Activate Account</div>
                                <div className="fs-6 text-muted">
                                    Please fill in your authentication token to activate your account.
                                </div>
                            </div>
                        )}

                        <UI.CardBody>
                            {this.state.activated && (
                                <UI.Row>
                                    <UI.Col classes="col-12 text-center">
                                        <h1>Success!</h1>
                                        Your CryptFolio account has been activated successfully.
                                        <br />
                                        <br />
                                        <NavLink exact to="/login" className="btn btn-sm btn-success mb-3">
                                            Go to Login page
                                        </NavLink>
                                    </UI.Col>
                                </UI.Row>
                            )}
                            {!this.state.activated && (
                                <>
                                    <UI.FormRow>
                                        <UI.FormColLabel>
                                            <UI.FormLabel>Authentication Token:</UI.FormLabel>
                                        </UI.FormColLabel>
                                        <UI.FormColInput>
                                            <UI.Input
                                                name="authToken"
                                                type="text"
                                                value={this.state.authToken}
                                                onChange={this.handleChange}
                                                classes="btn-dark w-100"
                                            />
                                        </UI.FormColInput>
                                    </UI.FormRow>
                                    <UI.FormRow>
                                        <UI.FormColInput classes="offset-md-4">
                                            <div className="form-text text-danger fs-7 fst-italic">
                                                {this.state.activateErrors.map((error) => (
                                                    <div key={error}>{error}</div>
                                                ))}
                                            </div>
                                            <div className="form-text text-success fs-7 fst-italic">
                                                {this.state.activateSuccess}
                                            </div>
                                        </UI.FormColInput>
                                    </UI.FormRow>
                                    <UI.FormRow>
                                        <UI.FormColLabel>
                                            <label className="col-form-label text-white fst-italic fw-bold"></label>
                                        </UI.FormColLabel>
                                        <UI.FormColInput>
                                            <NavLink exact to="/login" className="btn btn-sm btn-dark float-start">
                                                Back to Login page
                                            </NavLink>
                                            <button
                                                className="btn btn-sm btn-success float-end"
                                                disabled={!this.validateForm()}
                                                onClick={(event) => this.handleClick(event)}
                                            >
                                                Activate Account
                                            </button>
                                        </UI.FormColInput>
                                    </UI.FormRow>
                                </>
                            )}
                        </UI.CardBody>
                    </UI.Card>
                </UI.Col>
            </UI.Row>
        );
    }
}

// <div className="col-12 col-md-6 offset-md-3"><div className="card bg-lighter rounded-3 text-white p-0 border-0"><div className="card-body bg-lighter rounded-3 pb-2"><div className="row"><div className="col-12 text-center"><h1>Success!</h1>Your CryptFolio account has been activated successfully.<br><br><a href="http://localhost:8080/CryptFolio/login" className="btn btn-sm btn-success mb-3 navigate">Go to Login page</a></div></div></div></div></div>
