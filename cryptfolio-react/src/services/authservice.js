import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import helper from '../utils/helper';

const authservice = {
    login: function (username, password, remember_me, handleLogin, handleErrors) {
        fetch(process.env.REACT_APP_API_AUTH_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                remember_me: remember_me,
            }),
        })
            .then(helper.handleResponse)
            .then((data) => {
                if (data.status == 200) {
                    this.setUserState(data.result.user);
                    this.setTokenState(data.result.token);
                    handleLogin(data.result);
                    console.log('Succesfull logged in');
                    return true;
                } else {
                    handleErrors(data.errors);
                    return false;
                }
            })
            .catch((error) => {
                console.log(error);
                return false;
            });
    },
    register: function (user, handleSuccess, handleErrors) {
        fetch(process.env.REACT_APP_API_AUTH_REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user.username,
                password: user.password,
                password_confirmation: user.password_confirmation,
                email: user.email,
                baseURL: process.env.REACT_APP_BASE_URL,
            }),
        })
            .then(helper.handleResponse)
            .then((data) => {
                console.log(data);
                if (data.status == 200) {
                    handleSuccess(data.result.message);
                } else {
                    handleErrors(data.errors);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
    logout: function () {
        return fetch(process.env.REACT_APP_API_AUTH_LOGOUT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: this.getTokenState(),
                username: this.getUserState().username,
            }),
        })
            .then(helper.handleResponse)
            .then((response) => {
                if (response.result.logout) {
                    this.removeStorage();
                    setTimeout(() => {
                        return true;
                    }, 1000);
                }

                return false;
            })
            .catch((error) => {
                console.log(error);
            });
    },
    checkSession: function () {
        if (this.noStorage()) {
            return false;
        } else {
            return fetch(process.env.REACT_APP_API_AUTH_CHECK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.getTokenState(),
                    username: this.getUserState().username,
                    password: this.getUserState().password,
                }),
            })
                .then(helper.handleResponse)
                .then((response) => {
                    if (response.result.session == true) {
                        return true;
                    } else if (response.result.session == false) {
                        this.removeStorage();
                        return false;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    },
    removeStorage: function () {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },
    getUserState: function () {
        if (localStorage.getItem('user') != null) {
            return JSON.parse(localStorage.getItem('user'));
        }
        return {};
    },
    setUserState: function (user) {
        localStorage.setItem('user', JSON.stringify(user));
    },
    getTokenState: function () {
        if (localStorage.getItem('token') != null) {
            return localStorage.getItem('token');
        }
        return '';
    },
    setTokenState: function (token) {
        localStorage.setItem('token', token);
    },
    loggedInStatus: function () {
        return this.getUserState() != '' && this.getTokenState() != '';
    },
    loggedIn: function () {
        if (!this.loggedInStatus()) {
            return false;
        }

        return this.checkSession();
    },
    admin: function () {
        if (this.loggedInStatus()) {
            return this.getUserState().admin;
        }

        return false;
    },
    noStorage: function () {
        return this.getUserState() == null && this.getTokenState() == null;
    },
    checkingPage(props) {
        if (props.history.action == 'POP') {
            if (this.loggedIn()) {
                return true;
            }

            return false;
        } else if (props.history.action == 'PUSH') {
            if (props.loggedIn) {
                return true;
            }

            return false;
        }
    },
};

export default authservice;
