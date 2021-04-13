import React, { useState } from 'react';
import helper from '../utils/helper';
import authservice from './authservice';

const tokenservice = {
    addToken: function (tokenObject, handleErrors, handleSuccess) {
        fetch(process.env.REACT_APP_API_TOKEN_CREATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: authservice.getTokenState(),
                username: authservice.getUserState().username,
                tokenObject: tokenObject,
            }),
        })
            .then(helper.handleResponse)
            .then((data) => {
                if (data.status == 200) {
                    handleSuccess(data.result, 'add', 'Token successfully added');
                } else {
                    handleErrors(data.errors, 'add');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
    updateToken: function (tokenObject, handleErrors, handleSuccess) {
        fetch(process.env.REACT_APP_API_TOKEN_UPDATE, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: authservice.getTokenState(),
                username: authservice.getUserState().username,
                tokenObject: tokenObject,
            }),
        })
            .then(helper.handleResponse)
            .then((data) => {
                if (data.status == 200) {
                    handleSuccess(data.result, 'update', 'Token successfully saved!');
                } else {
                    handleErrors(data.errors, 'update');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
    removeToken: function (tokenID, handleErrors, handleSuccess) {
        fetch([process.env.REACT_APP_API_TOKEN_DELETE, tokenID].join('/'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: authservice.getTokenState(),
                username: authservice.getUserState().username,
            }),
        })
            .then(helper.handleResponse)
            .then((data) => {
                if (data.status == 200) {
                    handleSuccess(data.result, 'remove', 'Token successfully removed!');
                } else {
                    handleErrors(data.errors, tokenID);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
    getTokens: function (data) {
        return fetch(process.env.REACT_APP_API_TOKEN_GETALL + data, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
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
};

export default tokenservice;
