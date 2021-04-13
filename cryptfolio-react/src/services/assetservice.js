import React, { useState } from 'react';
import helper from '../utils/helper';
import authservice from './authservice';

const assetservice = {
    addAsset: function (asset, handleErrors, handleSuccess) {
        fetch(process.env.REACT_APP_API_ASSET_CREATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: authservice.getTokenState(),
                username: authservice.getUserState().username,
                asset: asset,
            }),
        })
            .then(helper.handleResponse)
            .then((data) => {
                if (data.status == 200) {
                    handleSuccess('Asset added to portfolio!', 'assets');
                } else {
                    handleErrors(data.errors, 'assets');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
    updateAsset: function (asset, handleErrors, handleSuccess) {
        fetch(process.env.REACT_APP_API_ASSET_UPDATE, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: authservice.getTokenState(),
                username: authservice.getUserState().username,
                asset: asset,
            }),
        })
            .then(helper.handleResponse)
            .then((data) => {
                if (data.status == 200) {
                    handleSuccess('Asset successfully saved!', asset.id);
                } else {
                    handleErrors(data.errors, asset.id);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
    removeAsset: function (assetID, handleErrors, handleSuccess) {
        fetch([process.env.REACT_APP_API_ASSET_DELETE, assetID].join('/'), {
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
                    handleSuccess('Asset successfully removed!', 'assets');
                } else {
                    handleErrors(data.errors, 'assets');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
    getAsset: function (assetID) {
        return fetch(
            [
                process.env.REACT_APP_API_ASSET_GET,
                assetID,
                authservice.getTokenState(),
                authservice.getUserState().username,
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
    getAssets: function (portfolioID) {
        return fetch(
            [
                process.env.REACT_APP_API_ASSET_GETALL,
                portfolioID,
                authservice.getTokenState(),
                authservice.getUserState().username,
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
                    return false;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    },
};

export default assetservice;
