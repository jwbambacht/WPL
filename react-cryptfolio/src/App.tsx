import React, { useState } from 'react';
import Header from './components/partials/Header';
import Main from './components/partials/Main';
import Footer from './components/partials/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/bootstrap-icons.css';
import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'jquery/dist/jquery.min.js';

function App() {
    return (
        <React.Fragment>
            <Header />
            <Main />
            <Footer />
        </React.Fragment>
    );

    // return (
    //     <div className="App">
    //         <header className="App-header">
    //             <img src={logo} className="App-logo" alt="logo" />
    //             <p>
    //                 Edit <code>src/App.tsx</code> and save to reload.
    //             </p>
    //             <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
    //                 Learn React
    //             </a>
    //         </header>
    //     </div>
    // );
}

export default App;
