import React, { useState } from 'react';
import helper from '../utils/helper';
import authservice from './authservice';

const portfolioservice = {
    addPortfolio: function (portfolioName, handleErrors, handleSuccess) {
        fetch(process.env.REACT_APP_API_PORTFOLIO_CREATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: authservice.getTokenState(),
                username: authservice.getUserState().username,
                portfolioName: portfolioName,
            }),
        })
            .then(helper.handleResponse)
            .then((data) => {
                if (data.status == 200) {
                    handleSuccess(data.result.portfolioID);
                } else {
                    handleErrors(data.errors);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
    updatePortfolio: function (portfolio, handleErrors, handleSuccess) {
        fetch(process.env.REACT_APP_API_PORTFOLIO_UPDATE, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: authservice.getTokenState(),
                username: authservice.getUserState().username,
                portfolio: portfolio,
            }),
        })
            .then(helper.handleResponse)
            .then((data) => {
                if (data.status == 200) {
                    handleSuccess('Portfolio successfully saved!', 'general');
                } else {
                    handleErrors(data.errors, 'general');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
    removePortfolio: function (portfolioID, handleErrors, handleSuccess) {
        return fetch([process.env.REACT_APP_API_PORTFOLIO_DELETE, portfolioID].join('/'), {
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
                    return true;
                } else {
                    return false;
                }
            })
            .catch((error) => {
                console.log(error);
                return false;
            });
    },
    getPortfolio: function (id, includeData) {
        return fetch(
            [
                process.env.REACT_APP_API_PORTFOLIO_GET,
                id,
                authservice.getTokenState(),
                authservice.getUserState().username,
                includeData ? 'data' : '',
            ].join('/'),
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
    getPortfolios: function (includeData) {
        return fetch(
            [
                process.env.REACT_APP_API_PORTFOLIO_GETALL,
                authservice.getTokenState(),
                authservice.getUserState().username,
                includeData ? 'data' : '',
            ].join('/'),
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
};

export default portfolioservice;
