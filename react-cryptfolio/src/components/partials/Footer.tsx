import React from 'react';

function Footer() {
    return (
        <footer className="text-muted fixed-bottom p-2 mt-2 bg-dark">
            <div className="container text-center">
                &copy; 2021 Cryptofolio. Built for Web Programming Languages using{' '}
                <a href="https://www.webdsl.org" target="_blank" rel="noreferrer" className="link-dark navigate">
                    WebDSL
                </a>
            </div>
        </footer>
    );
}

export default Footer;
