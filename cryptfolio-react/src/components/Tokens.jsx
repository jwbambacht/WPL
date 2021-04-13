import React, { Component } from 'react';
import authservice from '../services/authservice';
import tokenservice from '../services/tokenservice';
import * as UI from './elements/UIElements';

export default class Tokens extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: authservice.getUserState(),
            token: authservice.getTokenState(),
            newToken: {
                name: '',
                symbol: '',
            },
            tokens: [],
            errors: [],
            success: '',
            currentType: '',
            isLoading: true,
        };

        this.handleClick = this.handleClick.bind(this);

        this.handleChangeNewToken = this.handleChangeNewToken.bind(this);
        this.handleChangeUpdateToken = this.handleChangeUpdateToken.bind(this);

        this.handleErrors = this.handleErrors.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);

        this.getTokenData = this.getTokenData.bind(this);
    }

    handleErrors(errors, type) {
        if (errors.length != 0) {
            this.setState({
                errors: errors.map(function (error) {
                    return error.error;
                }),
                success: '',
                currentType: type,
            });
        }
    }

    handleSuccess(data, type, message) {
        this.getTokenData();
        this.setState({
            ...this.state,
            currentType: type,
            success: message,
            errors: [],
            newToken: {
                name: '',
                symbol: '',
            },
        });
    }

    handleChangeNewToken(e) {
        this.setState({
            newToken: {
                ...this.state.newToken,
                [e.target.name]: e.target.value,
                [e.target.symbol]: e.target.value,
            },
        });
    }

    handleChangeUpdateToken(e, index, type) {
        const tokens = this.state.tokens;
        tokens[index][type] = e.target.value;
        this.setState({
            tokens: tokens,
        });
    }

    handleClick(e, type, index) {
        e.preventDefault();

        switch (type) {
            case 'add':
                return tokenservice.addToken(this.state.newToken, this.handleErrors, this.handleSuccess);
            case 'update':
                return tokenservice.updateToken(this.state.tokens[index], this.handleErrors, this.handleSuccess);
            case 'remove':
                return tokenservice.removeToken(this.state.tokens[index].id, this.handleErrors, this.handleSuccess);
        }
    }

    getTokenData() {
        var data = '';
        tokenservice.getTokens(data).then((data) => {
            if (!data.hasOwnProperty('errors')) {
                this.setState({
                    ...this.state,
                    tokens: data.tokens,
                    isLoading: false,
                });
            } else {
                this.setState({
                    ...this.state,
                    errors: data.errors.map(function (error) {
                        return error.error;
                    }),
                });
                this.props.history.push({
                    pathname: '/error',
                    state: {
                        statusCode: data.status,
                        errors: this.state.errors,
                    },
                });
            }
        });
    }

    componentDidMount() {
        if (authservice.checkingPage(this.props)) {
            if (authservice.admin()) {
                this.getTokenData();
            } else {
                this.props.history.push('/');
            }
        } else {
            this.props.history.push('/login');
        }
    }

    render() {
        return (
            <>
                <UI.PageTitle>Manage Tokens</UI.PageTitle>
                <UI.PageSubTitle>The following tokens will be available for all users</UI.PageSubTitle>
                <UI.Row classes="mt-4">
                    <UI.Col classes="col-12 col-md-6 mb-3">
                        <UI.Card>
                            <UI.CardHeader>
                                <UI.CardHeaderTitle>Add New Token</UI.CardHeaderTitle>
                            </UI.CardHeader>
                            <UI.CardBody>
                                <UI.FormRow>
                                    <UI.FormColLabel>
                                        <UI.FormLabel>Name</UI.FormLabel>
                                    </UI.FormColLabel>
                                    <UI.FormColInput>
                                        <UI.Input
                                            type="text"
                                            name="name"
                                            value={this.state.newToken.name}
                                            onChange={this.handleChangeNewToken}
                                            classes="form-control btn-dark w-100"
                                        />
                                    </UI.FormColInput>
                                </UI.FormRow>

                                <UI.FormRow>
                                    <UI.FormColLabel>
                                        <UI.FormLabel>Symbol</UI.FormLabel>
                                    </UI.FormColLabel>
                                    <UI.FormColInput>
                                        <UI.Input
                                            type="text"
                                            name="symbol"
                                            value={this.state.newToken.symbol}
                                            onChange={this.handleChangeNewToken}
                                            classes="form-control btn-dark w-100"
                                        />
                                    </UI.FormColInput>
                                </UI.FormRow>

                                <UI.FormRow>
                                    <UI.FormColInput classes="offset-md-4 text-success fst-italic fs-8">
                                        {this.state.currentType == 'add' && this.state.success}
                                    </UI.FormColInput>
                                </UI.FormRow>

                                <UI.FormRow>
                                    <UI.FormColInput classes="offset-md-4 text-danger fst-italic fs-8">
                                        {this.state.currentType == 'add' &&
                                            this.state.errors.map((error, index) => (
                                                <div key={'new-token-error-' + index}>{error}</div>
                                            ))}
                                    </UI.FormColInput>
                                </UI.FormRow>

                                <UI.FormRow>
                                    <UI.FormColInput classes="offset-md-4 text-end">
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={(event) => this.handleClick(event, 'add', null)}
                                        >
                                            Add Token
                                        </button>
                                    </UI.FormColInput>
                                </UI.FormRow>
                            </UI.CardBody>
                        </UI.Card>
                    </UI.Col>
                    <UI.Col classes="col-12 col-md-6 mb-4">
                        <UI.Card>
                            <UI.CardHeader classes="d-flex justify-content-between align-items-center">
                                <UI.CardHeaderTitle>Existing Tokens</UI.CardHeaderTitle>
                                <span>
                                    <div className="text-success fs-8 fst-italic">
                                        {this.state.currentType == 'remove' && this.state.success}
                                    </div>
                                    <div className="text-success fs-8 fst-italic">
                                        {this.state.currentType == 'update' && this.state.success && (
                                            <div className="mb-2">{this.state.success}</div>
                                        )}
                                    </div>
                                    <div className="text-danger fs-8 fst-italic">
                                        {this.state.errors.map((error, index) => (
                                            <div key={'change-error-' + index}>{error}</div>
                                        ))}
                                    </div>
                                </span>
                            </UI.CardHeader>
                            <UI.CardBody>
                                {this.state.isLoading && (
                                    <UI.Col classes="col-12 text-center py-4">
                                        <UI.Spinner />
                                    </UI.Col>
                                )}

                                <UI.List classes="p-0 m-0">
                                    {this.state.tokens.map((token, index) => (
                                        <UI.ListItem classes="bg-darkest mb-1 py-2 px-2" key={token.id}>
                                            <span className="d-flex align-items-center">
                                                <UI.FormInputGroup>
                                                    <UI.Input
                                                        type="text"
                                                        value={token.name}
                                                        onChange={(event) =>
                                                            this.handleChangeUpdateToken(event, index, 'name')
                                                        }
                                                        classes="form-control-sm bg-darker text-white me-1"
                                                        size="fs-8"
                                                    />
                                                    <UI.Input
                                                        type="text"
                                                        value={token.symbol}
                                                        onChange={(event) =>
                                                            this.handleChangeUpdateToken(event, index, 'symbol')
                                                        }
                                                        classes="form-control-sm bg-darker text-white me-1"
                                                        size="fs-8"
                                                    />
                                                    <button
                                                        className="btn btn-sm bg-danger text-white me-1 button fs-8"
                                                        onClick={(event) => this.handleClick(event, 'remove', index)}
                                                    >
                                                        <UI.Icon icon="bi-trash" />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm bg-success text-white button fs-8"
                                                        onClick={(event) => this.handleClick(event, 'update', index)}
                                                    >
                                                        <UI.Icon icon="bi-check" />
                                                    </button>
                                                </UI.FormInputGroup>
                                            </span>
                                        </UI.ListItem>
                                    ))}
                                </UI.List>
                            </UI.CardBody>
                        </UI.Card>
                    </UI.Col>
                </UI.Row>
            </>
        );
    }
}
