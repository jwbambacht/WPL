import React from 'react';

export default function Footer() {
    return (
        <footer className="text-muted fixed-bottom p-2 mt-2 bg-dark">
            <div className="container text-center">
                &copy; 2021 Cryptofolio. Built for Web Programming Languages using&nbsp;
                <a href="https://www.webdsl.org" target="_blank" rel="noreferrer" className="link-dark">
                    WebDSL
                </a>
                &nbsp;and&nbsp;
                <a href="https://www.reactjs.org" target="_blank" rel="noreferrer" className="link-dark">
                    ReactJS
                </a>
            </div>
        </footer>
    );
}
