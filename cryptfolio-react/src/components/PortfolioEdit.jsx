import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import helper from '../utils/helper';
import authservice from '../services/authservice';
import tokenservice from '../services/tokenservice';
import portfolioservice from '../services/portfolioservice';
import assetservice from '../services/assetservice';
import * as UI from './elements/UIElements';

export default class PortfolioEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            portfolio: {
                id: this.props.match.params.id,
                name: '',
                assets: [],
                cost: 0,
            },
            assets: [],
            asset_new: {
                portfolioID: this.props.match.params.id,
                tokenID: '',
                balance: 0,
            },
            tokens: [],
            errors: [],
            success: [],
            apiErrors: [],
            isLoading: true,
        };

        this.handleClickSave = this.handleClickSave.bind(this);
        this.handleClickNewAsset = this.handleClickNewAsset.bind(this);
        this.handleClickRemoveAsset = this.handleClickRemoveAsset.bind(this);
        this.handleClickRemovePortfolio = this.handleClickRemovePortfolio.bind(this);
        this.handleChangePortfolio = this.handleChangePortfolio.bind(this);
        this.handleChangeAsset = this.handleChangeAsset.bind(this);
        this.handleChangeNewAsset = this.handleChangeNewAsset.bind(this);

        this.handleErrors = this.handleErrors.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);

        this.getData = this.getData.bind(this);
    }

    handleChangePortfolio(e) {
        this.setState({
            portfolio: {
                ...this.state.portfolio,
                [e.target.name]: e.target.value,
            },
        });
    }

    handleChangeAsset(e, index, type) {
        this.setState({
            errors: [],
            success: [],
        });

        const assets = this.state.assets;
        const asset = assets[index];
        var change = true;

        if (type == 'balance') {
            if (e.target.value.toString().slice(-1) == '.') {
                change = false;
            }

            asset.balance = e.target.value;
            assets[index] = { ...asset };
        } else if (type == 'active') {
            asset.active = !asset.active;
            assets[index] = { ...asset };
        } else if (type == 'order') {
            asset.order = index;
            assets[index] = { ...asset };
        }

        if (change) {
            this.setState({
                assets: assets,
            });

            assetservice.updateAsset(
                {
                    id: asset.id,
                    balance: asset.balance,
                    order: parseInt(asset.order),
                    active: asset.active,
                },
                this.handleErrors,
                this.handleSuccess,
            );
        }
    }

    handleChangeNewAsset(e) {
        this.setState({
            asset_new: {
                ...this.state.asset_new,
                [e.target.name]: e.target.value,
            },
        });
    }

    handleClickNewAsset(e) {
        e.preventDefault();

        assetservice.addAsset(this.state.asset_new, this.handleErrors, this.handleSuccess);
    }

    handleClickSave(e, type) {
        e.preventDefault();

        this.setState({
            errors: [],
            success: [],
        });
        portfolioservice.updatePortfolio(
            { id: this.state.portfolio.id, name: this.state.portfolio.name, cost: this.state.portfolio.cost },
            this.handleErrors,
            this.handleSuccess,
        );
    }

    handleClickRemoveAsset(e, assetID) {
        e.preventDefault();

        assetservice.removeAsset(assetID, this.handleErrors, this.handleSuccess);
    }

    handleClickRemovePortfolio(e) {
        e.preventDefault();

        if (window.confirm('Are u sure?')) {
            if (portfolioservice.removePortfolio(this.state.portfolio.id, this.handleErrors, this.handleSuccess)) {
                setTimeout(() => {
                    this.props.history.push('/portfolios');
                }, 500);
            }
        }
    }

    handleErrors(errors, type) {
        const erray = errors.map(function (error) {
            return error.error;
        });

        if (type == 'assets') {
            this.setState({
                errors: { [type]: erray },
                success: [],
            });
        } else if (type == 'general') {
            this.setState({
                errors: { [type]: erray },
                success: [],
            });
        } else {
            this.setState({
                errors: { ...this.state.errors, [type]: erray },
            });
        }
    }

    handleSuccess(message, type) {
        this.setState({
            success: { [type]: message },
        });

        if (type != 'general') {
            this.getData();
        }
    }

    getData() {
        portfolioservice
            .getPortfolio(this.state.portfolio.id, false)
            .then((data) => {
                if (!data.hasOwnProperty('errors')) {
                    this.setState({
                        portfolio: data.portfolio,
                        assets: data.portfolio.assets.sort((a, b) => (a.token.name > b.token.name ? 1 : -1)),
                        apiErrors: [],
                    });
                } else {
                    this.setState({
                        ...this.state,
                        apiErrors: data.errors.map(function (error) {
                            return error.error;
                        }),
                    });
                    this.props.history.push({
                        pathname: '/error',
                        state: {
                            statusCode: data.status,
                            errors: this.state.apiErrors,
                        },
                    });
                }
            })
            .then(() => {
                if (this.state.apiErrors.length == 0) {
                    var data = '';
                    return tokenservice.getTokens(data);
                }
            })
            .then((data) => {
                if (this.state.apiErrors.length == 0) {
                    this.setState({
                        tokens: data.tokens,
                    });
                }
            })
            .then(() => {
                if (this.state.apiErrors.length == 0) {
                    const list = this.state.portfolio.assets.map((asset) => {
                        return { id: asset.token.id, name: asset.token.name, symbol: asset.token.symbol };
                    });

                    this.setState({
                        tokens: this.state.tokens.filter(({ id: id1 }) => !list.some(({ id: id2 }) => id2 === id1)),
                    });
                }
            })
            .then(() => {
                if (this.state.apiErrors.length == 0) {
                    if (this.state.tokens.length > 0) {
                        this.setState({
                            asset_new: {
                                ...this.state.asset_new,
                                tokenID: this.state.tokens[0].id,
                            },
                        });
                    }
                    this.setState({
                        ...this.state,
                        isLoading: false,
                    });
                }
            });
    }

    componentDidMount() {
        if (authservice.checkingPage(this.props)) {
            this.getData();
        } else {
            this.props.history.push('/login');
        }
    }

    render() {
        return (
            <>
                <UI.PageTitle classes="d-flex justify-content-between align-items-center">
                    Edit Portfolio
                    <NavLink exact to={'/portfolio/view/' + this.state.portfolio.id} className="fs-7 text-muted">
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to portfolio
                    </NavLink>
                </UI.PageTitle>
                <UI.PageSubTitle>
                    Change the portfolio's name or assets, adjust your balance or set the asset order.
                </UI.PageSubTitle>

                <UI.Row classes="mt-4">
                    <UI.Col classes="col-12 col-xl-6 mb-4">
                        <UI.Card>
                            <UI.CardHeader>
                                <UI.CardHeaderTitle>General</UI.CardHeaderTitle>
                            </UI.CardHeader>
                            <UI.CardBody>
                                {this.state.isLoading && (
                                    <UI.Col classes="col-12 text-center py-4">
                                        <UI.Spinner />
                                    </UI.Col>
                                )}

                                {!this.state.isLoading && (
                                    <>
                                        <UI.FormRow>
                                            <UI.FormColLabel>
                                                <UI.FormLabel>Name</UI.FormLabel>
                                            </UI.FormColLabel>
                                            <div className="col-12 col-md-8">
                                                <UI.Input
                                                    type="text"
                                                    name="name"
                                                    value={this.state.portfolio.name}
                                                    onChange={this.handleChangePortfolio}
                                                    classes="btn-dark w-100"
                                                />
                                            </div>
                                        </UI.FormRow>
                                        <UI.FormRow>
                                            <UI.FormColLabel>
                                                <UI.FormLabel>Cost</UI.FormLabel>
                                            </UI.FormColLabel>
                                            <div className="col-12 col-md-8">
                                                <UI.Input
                                                    name="cost"
                                                    value={this.state.portfolio.cost}
                                                    onChange={this.handleChangePortfolio}
                                                    classes="btn-dark w-100"
                                                />
                                            </div>
                                        </UI.FormRow>

                                        <UI.FormRow classes="fst-italic">
                                            <UI.FormColInput classes="offset-md-4">
                                                <UI.Col classes="col-12 text-success">
                                                    {this.state.success.general}
                                                </UI.Col>
                                                <UI.Col classes="col-12 text-danger">
                                                    {this.state.errors.general != null &&
                                                        this.state.errors.general.map((error, index) => (
                                                            <div key={'update-portfolio-error-' + index}>{error}</div>
                                                        ))}
                                                </UI.Col>
                                            </UI.FormColInput>
                                        </UI.FormRow>

                                        <UI.FormRow>
                                            <UI.Col classes="col-12 d-flex justify-content-between">
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={this.handleClickRemovePortfolio}
                                                >
                                                    Delete portfolio
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={(event) => this.handleClickSave(event, 'general')}
                                                >
                                                    Save portfolio
                                                </button>
                                            </UI.Col>
                                        </UI.FormRow>
                                    </>
                                )}
                            </UI.CardBody>
                        </UI.Card>
                    </UI.Col>

                    <UI.Col classes="col-12 col-xl-6 mb-4">
                        <UI.Card>
                            <UI.CardHeader classes="d-flex justify-content-between">
                                <UI.CardHeaderTitle>Assets</UI.CardHeaderTitle>
                                <span className="d-flex align-items-center">
                                    <span className="text-success fst-italic fs-7">{this.state.success['assets']}</span>
                                    <span className="text-danger fst-italic fs-7">{this.state.errors['assets']}</span>
                                </span>
                            </UI.CardHeader>
                            <UI.CardBody>
                                {this.state.isLoading && (
                                    <UI.Col classes="col-12 text-center py-4">
                                        <UI.Spinner />
                                    </UI.Col>
                                )}

                                {!this.state.isLoading && this.state.tokens.length > 0 && (
                                    <UI.FormRow>
                                        <UI.Col classes="col-12">
                                            <UI.ListItem classes="bg-darkest text-white mb-1 d-flex align-items-center pe-0 ps-2">
                                                <select
                                                    name="tokenID"
                                                    value={this.state.asset_new.tokenID}
                                                    onChange={(event) => this.handleChangeNewAsset(event)}
                                                    className="form-select form-select-sm select-asset-new bg-darker border-0 text-white me-auto fs-7"
                                                >
                                                    {this.state.tokens.map((token) => (
                                                        <option value={token.id} key={token.id}>
                                                            {token.name} ({token.symbol})
                                                        </option>
                                                    ))}
                                                </select>

                                                <UI.FormInputGroup classes="w-100px">
                                                    <UI.Input
                                                        type="text"
                                                        name="balance"
                                                        value={this.state.asset_new.balance}
                                                        onChange={(event) => this.handleChangeNewAsset(event)}
                                                        classes="form-control-sm bg-darker"
                                                        size="fs-8"
                                                    />
                                                </UI.FormInputGroup>
                                                <button
                                                    className="btn btn-sm btn-success border-0 text-white ms-2 me-2 w-48px fs-7"
                                                    onClick={this.handleClickNewAsset}
                                                >
                                                    Add
                                                </button>
                                            </UI.ListItem>
                                        </UI.Col>
                                    </UI.FormRow>
                                )}

                                {!this.state.isLoading && (
                                    <UI.Row>
                                        <UI.Col classes="col-12">
                                            {this.state.portfolio.assets.length == 0 && (
                                                <label className="col-form-label">No assets added</label>
                                            )}
                                            <UI.List classes="mb-0 ps-0">
                                                {this.state.assets.map((asset, index) => (
                                                    <>
                                                        <UI.ListItem
                                                            classes="asset-list-item bg-darkest text-white mb-1 pe-0 ps-2"
                                                            key={asset.id}
                                                        >
                                                            <div className="d-flex align-items-center lh-1-25">
                                                                <span className="p-0">
                                                                    {asset.active == true ? (
                                                                        <span
                                                                            className="btn btn-sm btn-success px-1 py-0 me-2"
                                                                            onClick={(event) =>
                                                                                this.handleChangeAsset(
                                                                                    event,
                                                                                    index,
                                                                                    'active',
                                                                                )
                                                                            }
                                                                        >
                                                                            <UI.Icon icon="bi-check" />
                                                                        </span>
                                                                    ) : (
                                                                        <span
                                                                            className="btn btn-sm btn-danger px-1 py-0 me-2"
                                                                            onClick={(event) =>
                                                                                this.handleChangeAsset(
                                                                                    event,
                                                                                    index,
                                                                                    'active',
                                                                                )
                                                                            }
                                                                        >
                                                                            <UI.Icon icon="bi-x" />
                                                                        </span>
                                                                    )}
                                                                </span>
                                                                <span className="me-auto fs-7">{asset.token.name}</span>
                                                                <UI.FormInputGroup classes="w-100px">
                                                                    <UI.Input
                                                                        type="text"
                                                                        value={asset.balance.toString()}
                                                                        name="balance"
                                                                        onChange={(event) =>
                                                                            this.handleChangeAsset(
                                                                                event,
                                                                                index,
                                                                                'balance',
                                                                            )
                                                                        }
                                                                        classes="form-control-sm bg-darker"
                                                                        size="fs-8"
                                                                    />
                                                                    <div className="input-group-text bg-darker border-0 text-white fs-10 px-2">
                                                                        {asset.token.symbol}
                                                                    </div>
                                                                </UI.FormInputGroup>
                                                                <button
                                                                    className="btn btn-sm btn-danger border-0 ms-2 me-2 fs-7"
                                                                    onClick={(event) =>
                                                                        this.handleClickRemoveAsset(event, asset.id)
                                                                    }
                                                                >
                                                                    <UI.Icon icon="bi-trash-fill" />
                                                                </button>
                                                            </div>

                                                            <UI.Input
                                                                type="hidden"
                                                                id={asset.id}
                                                                value={asset.order}
                                                                name="order"
                                                                onChange={() => {}}
                                                                classes="hidden-input"
                                                            />
                                                        </UI.ListItem>

                                                        <UI.Row classes="fst-italic text-center fs-8">
                                                            <UI.Col classes="col-12 text-success">
                                                                {this.state.success[asset.id] != null && (
                                                                    <div className="mb-2">
                                                                        {this.state.success[asset.id]}
                                                                    </div>
                                                                )}
                                                            </UI.Col>
                                                            <UI.Col classes="col-12 text-danger">
                                                                {this.state.errors[asset.id] != null &&
                                                                    this.state.errors[asset.id].map((error, index) => (
                                                                        <div
                                                                            className="mb-2"
                                                                            key={'update-portfolio-error-' + index}
                                                                        >
                                                                            {error}
                                                                        </div>
                                                                    ))}
                                                            </UI.Col>
                                                        </UI.Row>
                                                    </>
                                                ))}
                                            </UI.List>
                                        </UI.Col>
                                    </UI.Row>
                                )}
                            </UI.CardBody>
                        </UI.Card>
                    </UI.Col>
                </UI.Row>
            </>
        );
    }
}
