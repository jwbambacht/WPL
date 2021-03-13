import React from 'react';
import token from '../../token';
import helpers from '../../utils/helper';

function logout() {
    localStorage.clear();
}

export default function Header() {
    return (
        <header>
            <nav className="navbar navbar-dark bg-dark navbar-expand-md">
                <div className="container">
                    <a href="/" className="navbar-brand px-2 d-none d-md-block">
                        <img src="./assets/images/cryptfolio.svg" width="auto" height="27px" />
                    </a>
                    <a href="/" className="navbar-brand px-2 d-md-none">
                        <img src="./assets/images/cryptfolio_long.svg" width="auto" height="27px" />
                    </a>

                    <div
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse"
                        data-target="#navbarCollapse"
                        aria-controls="navbarCollapse"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        className="navbar-toggler collapsed"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </div>

                    <div id="navbarCollapse" className="collapse navbar-collapse">
                        <ul className="block navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="block nav-item">
                                <a href="/" className="nav-link">
                                    Dashboard
                                </a>
                            </li>
                        </ul>
                        <ul className="block navbar-nav me-0 mb-2 mb-lg-0 pull-right">
                            {!token ? (
                                <>
                                    <li className="block nav-item">
                                        <a href="/login" className="nav-link">
                                            Login
                                        </a>
                                    </li>
                                    <li className="block nav-item">
                                        <a href="/register" className="nav-link">
                                            Register
                                        </a>
                                    </li>
                                </>
                            ) : (
                                <li className="block nav-item">
                                    <a href="/logout" className="nav-link">
                                        Logout
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
