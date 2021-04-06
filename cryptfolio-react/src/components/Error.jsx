import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import helper from '../utils/helper';
import authservice from '../services/authservice';

export default class Error extends Component {
    constructor(props) {
        super(props);

        this.state = {
            statusCode: 404,
            errors: ['The page you are looking for was not found.'],
        };
    }

    componentDidMount() {
        if (this.props.history.action == 'POP') {
            this.props.history.push('/');
        }

        if (this.props.location.state != null) {
            this.setState({
                statusCode: this.props.location.state.statusCode,
                errors: this.props.location.state.errors,
            });
        }
    }

    render() {
        return (
            <>
                <h1 className="text-white mt-4 text-center fs-100pt">{this.state.statusCode}</h1>
                <div className="text-muted mb-2 text-center">
                    {this.state.errors.map((error) => (
                        <div key={error}>{error}</div>
                    ))}
                    <br />
                    <br />
                    <a
                        onClick={(event) => {
                            event.preventDefault();
                            this.props.history.go(-2);
                        }}
                        href=""
                        className="text-muted me-3"
                    >
                        Go Back
                    </a>
                    or
                    <NavLink exact to="/" className="text-muted ms-3">
                        Return the the Dashboard
                    </NavLink>
                </div>
            </>
        );
    }
}
