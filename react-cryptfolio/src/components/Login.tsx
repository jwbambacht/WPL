import React, { useState } from 'react';
import PropTypes from 'prop-types';
import userservice from '../services/userservice';

async function loginUser(credentials: Record<any, any>): Promise<any> {
    const response = await fetch('/CryptFolio/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
        }),
    });
    const body = await response.json();

    return body[0];
}

function Login({ setToken }: any): any {
    // // const [username, setUser.username] = React.useState<string | User>();
    // const [username, setUserName] = React.useState<string | void>();
    // const [password, setPassword] = React.useState<string | void>();

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();

    //     console.log(username + ' ' + password);

    //     if (username == null || password == null) {
    //         return;
    //     }

    //     const response = await loginUser({
    //         username,
    //         password,
    //     })
    //         .then((data) => {
    //             console.log(data.message);

    //             if (data.message == 'ok') {
    //                 setToken(data.token);
    //             } else {
    //                 console.log('Credentials incorrect');
    //             }
    //         })
    //         .catch((error) => {
    //             Promise.reject(new Error('Backend server offline'));
    //             // throw new Error('Backend server offline');
    //         });
    // };

    const [username, setUserName] = React.useState<string | void>();
    const [password, setPassword] = React.useState<string | void>();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!(username && password)) {
            return;
        }

        userservice.login(username, password);
    };

    return (
        <div className="col-12 col-md-6 offset-md-3">
            <div className="card bg-lighter rounded-3 text-white p-0 border-0">
                <div className="card-header bg-lighter fs-3">
                    <div className="fw-bold">Login</div>
                    <div className="fs-6 text-muted">Please fill in your credentials below to login.</div>
                </div>
                <div className="card-body bg-lighter rounded-3 pb-2">
                    <form onSubmit={handleSubmit}>
                        <div className="align-items-center mb-2 row">
                            <div className="col-12 col-md-4">
                                <label className="col-form-label text-white fst-italic fw-bold">Username</label>
                            </div>
                            <div className="col-12 col-md-8">
                                <input
                                    type="text"
                                    className="inputString form-control btn-dark w-100"
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="align-items-center mb-2 row">
                            <div className="col-12 col-md-8 offset-md-4"></div>
                        </div>
                        <div className="align-items-center mb-2 row">
                            <div className="col-12 col-md-4">
                                <label className="col-form-label text-white fst-italic fw-bold">Password</label>
                            </div>
                            <div className="col-12 col-md-8">
                                <input
                                    type="password"
                                    className="inputSecret form-control btn-dark w-100"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="align-items-center mb-2 row">
                            <div className="col-12 col-md-8 offset-md-4"></div>
                        </div>
                        <div className="align-items-center mb-2 row">
                            <div className="col-12 col-md-4">
                                <label className="col-form-label text-white fst-italic fw-bold"></label>
                            </div>
                            <div className="col-12 col-md-8 d-flex justify-content-between align-items-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        type="checkbox"
                                        id="stayLoggedInCheckbox"
                                        className="inputBool form-check-input"
                                    />
                                    <label className="form-check-label">Remember me</label>
                                </div>
                                <a href="./forgotPassword" className="fs-7 text-muted navigate">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="align-items-center mb-2 row">
                            <div className="col-12 col-md-8 offset-md-4">
                                <div className="form-text text-danger fs-7 fst-italic"></div>
                            </div>
                        </div>
                        <div className="align-items-center mb-2 row">
                            <div className="col-12 col-md-4">
                                <label className="col-form-label text-white fst-italic fw-bold"></label>
                            </div>
                            <div className="col-12 col-md-8">
                                <a href="./register" className="btn btn-sm btn-dark float-start navigate">
                                    Go to Register page
                                </a>
                                <button type="submit" className="btn btn-sm btn-success float-end">
                                    Login
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        // <label>
        //     <p>Username</p>
        //     <input type="text" onChange={(e) => setUserName(e.target.value)} />
        // </label>
        // <label className="validation-username">
        //     <p>Username cannot be empty</p>
        // </label>
        // <label>
        //     <p>Password</p>
        //     <input type="password" onChange={(e) => setPassword(e.target.value)} />
        // </label>
        // <label className="validation-password">Password cannot be empty</label>
        // <div>
        //     <button type="submit">Submit</button>
        // </div>
    );
}

export default Login;

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
};
