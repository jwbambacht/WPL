import React, { useState } from 'react';
import helper from '../utils/helper';
import authservice from './authservice';

const userservice = {
    updateProfile: function (user, handleErrors, handleSuccess) {
        fetch(process.env.REACT_APP_API_USER_PROFILE, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: authservice.getTokenState(),
                username: authservice.getUserState().username,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
            }),
        })
            .then(helper.handleResponse)
            .then((data) => {
                if (data.status == 200) {
                    authservice.setUserState(data.result.user);
                    handleSuccess('profile', 'Profile successfully saved!');
                } else if (data.status == 400) {
                    handleErrors(data.errors, 'profile');
                } else if (data.status == 401) {
                    authservice.removeStorage();
                    handleErrors(data.errors, 'profile');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
    updatePassword: function (password, password_confirmation, handleErrors, handleSuccess) {
        fetch(process.env.REACT_APP_API_USER_PASSWORD, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: authservice.getTokenState(),
                username: authservice.getUserState().username,
                user: {
                    password: password,
                    password_confirmation: password_confirmation,
                },
            }),
        })
            .then(helper.handleResponse)
            .then((data) => {
                if (data.status == 200) {
                    if (data.result.password) {
                        authservice.setUserState(data.result.user);
                        handleSuccess('password', 'Password successfully saved!');
                    }
                } else if (data.status == 400) {
                    handleErrors(data.errors, 'password');
                } else if (data.status == 401) {
                    authservice.removeStorage();
                    handleErrors(data.errors, 'password');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
    getUser: function () {
        return fetch(
            [process.env.REACT_APP_API_USER_GET, authservice.getTokenState(), authservice.getUserState().username].join(
                '/',
            ),
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
            .then(helper.handleResponse)
            .then((data) => {
                if (data.status == 200) {
                    return data.result;
                } else {
                    return data;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
    forgotPassword: function (username, password, password_confirmation, handleErrors, handleSuccess) {
        fetch(process.env.REACT_APP_API_USER_PASSWORD, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                password_confirmation: password_confirmation,
                baseURL: process.env.REACT_APP_BASE_URL + '/',
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
    activateAccount: function (authToken, handleErrors, handleSuccess) {
        fetch(process.env.REACT_APP_API_USER_ACTIVATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                authToken: authToken,
            }),
        })
            .then(helper.handleResponse)
            .then((response) => {
                if (response.status == 200) {
                    handleSuccess(response.result.message);
                } else {
                    handleErrors(response.errors);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
};

export default userservice;
