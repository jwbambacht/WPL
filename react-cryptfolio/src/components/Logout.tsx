import React from 'react';
import { Redirect } from 'react-router-dom';
import Token from '../token';

function Logout() {
    const { token, setToken } = Token();

    localStorage.clear();
    setToken('');

    return <Redirect to="/dashboard" />;
}

export default Logout;
