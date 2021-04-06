import React, { Component, useEffect } from 'react';
import authservice from '../services/authservice';
import userservice from '../services/userservice';
import * as UI from './elements/UIElements';

export default class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: authservice.getUserState(),
            token: authservice.getTokenState(),
            password: '',
            password_confirmation: '',
            errors: [],
            success: '',
            currentType: '',
            isLoading: true,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.getUserData = this.getUserData.bind(this);
    }

    handleErrors(errors, type) {
        if (errors.length != 0) {
            this.setState({
                errors: errors.map(function (error) {
                    return error.error;
                }),
                success: '',
                currentType: type,
            });
        }
    }

    handleSuccess(type, message) {
        this.setState({
            errors: [],
            success: message,
            currentType: type,
        });
    }

    handleClick(e, type) {
        e.preventDefault();

        switch (type) {
            case 'profile':
                return userservice.updateProfile(this.state.user, this.handleErrors, this.handleSuccess);
            case 'password':
                return userservice.updatePassword(
                    this.state.password,
                    this.state.password_confirmation,
                    this.handleErrors,
                    this.handleSuccess,
                );
        }
    }

    handleChange(e, type) {
        switch (type) {
            case 'profile':
                return this.setState({
                    user: {
                        ...this.state.user,
                        [e.target.name]: e.target.value,
                    },
                });
            case 'password':
                return this.setState({
                    [e.target.name]: e.target.value,
                });
        }
    }

    getUserData() {
        userservice.getUser().then((data) => {
            if (!data.hasOwnProperty('errors')) {
                this.setState({
                    ...this.state,
                    user: {
                        username: data.user.username,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        email: data.user.email,
                        admin: data.user.admin,
                    },
                    isLoading: false,
                });
            } else {
                this.setState({
                    ...this.state,
                    errors: data.errors.map(function (error) {
                        return error.error;
                    }),
                });
                this.props.history.push({
                    pathname: '/error',
                    state: {
                        statusCode: data.status,
                        errors: this.state.errors,
                    },
                });
            }
        });
    }

    componentDidMount() {
        if (authservice.checkingPage(this.props)) {
            this.getUserData();
        } else {
            this.props.history.push('/login');
        }
    }

    render() {
        return (
            <>
                <UI.PageTitle>Account</UI.PageTitle>
                <UI.PageSubTitle>Edit your account details</UI.PageSubTitle>
                <UI.Row classes="mt-4">
                    <UI.Col classes="col-12 col-md-6 mb-3">
                        <UI.Card>
                            <UI.CardHeader>
                                <span className="fw-bold">Profile</span>
                            </UI.CardHeader>
                            <form onSubmit={this.handleProfileSubmit}>
                                <UI.CardBody classes="pb-2">
                                    {this.state.isLoading && (
                                        <UI.Col classes="col-12 text-center py-4">
                                            <UI.Spinner />
                                        </UI.Col>
                                    )}

                                    {!this.state.isLoading && (
                                        <>
                                            <UI.FormRow>
                                                <UI.FormColLabel>
                                                    <UI.FormLabel>Username</UI.FormLabel>
                                                </UI.FormColLabel>
                                                <UI.FormColInput>
                                                    <UI.Input
                                                        type="text"
                                                        disabled="disabled"
                                                        value={this.state.user.username}
                                                        classes="btn-dark w-100 text-muted"
                                                    />
                                                </UI.FormColInput>
                                            </UI.FormRow>
                                            <UI.FormRow>
                                                <UI.FormColLabel>
                                                    <UI.FormLabel>First Name</UI.FormLabel>
                                                </UI.FormColLabel>
                                                <UI.FormColInput>
                                                    <UI.Input
                                                        type="text"
                                                        name="firstName"
                                                        value={this.state.user.firstName}
                                                        onChange={(event) => this.handleChange(event, 'profile')}
                                                        classes="btn-dark w-100"
                                                    />
                                                </UI.FormColInput>
                                            </UI.FormRow>
                                            <UI.FormRow>
                                                <UI.FormColLabel>
                                                    <UI.FormLabel>Last Name</UI.FormLabel>
                                                </UI.FormColLabel>
                                                <UI.FormColInput>
                                                    <UI.Input
                                                        type="text"
                                                        name="lastName"
                                                        value={this.state.user.lastName}
                                                        onChange={(event) => this.handleChange(event, 'profile')}
                                                        classes="btn-dark w-100"
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
                                                        value={this.state.user.email}
                                                        onChange={(event) => this.handleChange(event, 'profile')}
                                                        classes="btn-dark w-100"
                                                    />
                                                </UI.FormColInput>
                                            </UI.FormRow>
                                            <UI.FormRow>
                                                <UI.FormColLabel>
                                                    <UI.FormLabel>Account Type</UI.FormLabel>
                                                </UI.FormColLabel>
                                                <UI.FormColInput>
                                                    <UI.Input
                                                        type="text"
                                                        disabled="disabled"
                                                        value={this.state.user.admin ? 'Admin' : 'User'}
                                                        classes="btn-dark w-100 text-muted"
                                                    />
                                                </UI.FormColInput>
                                            </UI.FormRow>
                                            <UI.FormRow classes="text-danger fst-italic fs-7">
                                                <UI.FormColInput classes="offset-md-4 fst-italic">
                                                    {this.state.currentType == 'profile' &&
                                                        this.state.errors.map((error, index) => (
                                                            <div key={'profile-error-' + index}>{error}</div>
                                                        ))}
                                                </UI.FormColInput>
                                            </UI.FormRow>
                                            <UI.FormRow classes="text-success fst-italic fs-7">
                                                <UI.FormColInput classes="offset-md-4">
                                                    {this.state.currentType == 'profile' && this.state.success}
                                                </UI.FormColInput>
                                            </UI.FormRow>
                                            <UI.FormRow>
                                                <UI.FormColLabel>
                                                    <label className="col-form-label text-white fst-italic fw-bold"></label>
                                                </UI.FormColLabel>
                                                <UI.FormColInput classes="text-end">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-sm btn-success"
                                                        onClick={(event) => this.handleClick(event, 'profile')}
                                                    >
                                                        Save
                                                    </button>
                                                </UI.FormColInput>
                                            </UI.FormRow>
                                        </>
                                    )}
                                </UI.CardBody>
                            </form>
                        </UI.Card>
                    </UI.Col>

                    <UI.Col classes="col-12 col-md-6 mb-3">
                        <UI.Card>
                            <UI.CardHeader>
                                <span className="fw-bold">Change Password</span>
                            </UI.CardHeader>
                            <UI.CardBody>
                                <UI.FormRow>
                                    <UI.FormColLabel>
                                        <UI.FormLabel>New Password</UI.FormLabel>
                                    </UI.FormColLabel>
                                    <UI.FormColInput>
                                        <UI.Input
                                            type="password"
                                            name="password"
                                            value={this.state.password}
                                            onChange={(event) => this.handleChange(event, 'password')}
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
                                            onChange={(event) => this.handleChange(event, 'password')}
                                            classes="btn-dark w-100"
                                        />
                                    </UI.FormColInput>
                                </UI.FormRow>
                                <UI.FormRow>
                                    <UI.FormColInput classes="offset-md-4 text-danger fst-italic fs-7">
                                        {this.state.currentType == 'password' &&
                                            this.state.errors.map((error, index) => (
                                                <div key={'profile-error-' + index}>{error}</div>
                                            ))}
                                    </UI.FormColInput>
                                </UI.FormRow>
                                <UI.FormRow>
                                    <UI.FormColInput classes="offset-md-4 text-success fst-italic fs-7">
                                        {this.state.currentType == 'password' && this.state.success}
                                    </UI.FormColInput>
                                </UI.FormRow>

                                <UI.FormRow>
                                    <UI.FormColLabel>
                                        <label className="col-form-label text-white fst-italic fw-bold"></label>
                                    </UI.FormColLabel>
                                    <UI.FormColInput classes="text-end">
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-success"
                                            onClick={(event) => this.handleClick(event, 'password')}
                                        >
                                            Save
                                        </button>
                                    </UI.FormColInput>
                                </UI.FormRow>
                            </UI.CardBody>
                        </UI.Card>
                    </UI.Col>
                </UI.Row>
            </>
        );
    }
}
