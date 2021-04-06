import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import helper from '../utils/helper';
import authservice from '../services/authservice';
import portfolioservice from '../services/portfolioservice';
import assetservice from '../services/assetservice';
import * as UI from './elements/UIElements';
import { AssetChart } from './elements/Chart';

const intervals = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '8h', '12h', '1d', '3d', '1w', '1M'];

export default class Asset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            asset: {
                id: '',
                balance: '',
                value: '',
                value24h: '',
                portfolio: {
                    id: '',
                    name: '',
                },
            },
            token: {
                id: '',
                name: '',
                symbol: '',
            },
            data: {
                price: 0,
                prevDay: 0,
                change: 0,
                high: 0,
                low: 0,
                volume: 0,
            },
            errors: [],
            success: '',
            portfolios: [],
            interval: '4h',
            spinner: true,
            apiErrors: [],
            isLoading: true,
            chart: null,
        };

        this.baseState = this.state;
        this.handleChange = this.handleChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.getData = this.getData.bind(this);

        this.intervalSelector = this.intervalSelector.bind(this);
        this.hasLoaded = this.hasLoaded.bind(this);
        this.initFeedback = this.initFeedback.bind(this);
    }

    handleErrors(errors) {
        if (errors.length != 0) {
            this.setState(
                {
                    errors: errors.map(function (error) {
                        return error.error;
                    }),
                    success: '',
                },
                () => {
                    this.initFeedback();
                },
            );
        }
    }

    handleSuccess(message) {
        this.setState(
            {
                errors: [],
                success: message,
            },
            () => {
                this.initFeedback();
            },
        );
    }

    initFeedback() {
        setTimeout(() => {
            this.setState({
                errors: [],
                success: '',
            });
        }, 2000);
    }

    handleChange(e) {
        this.setState(
            {
                asset: {
                    ...this.state.asset,
                    balance: e.target.value,
                },
            },
            () => {
                assetservice.updateAsset(this.state.asset, this.handleErrors, this.handleSuccess);
            },
        );
    }

    intervalSelector(e, interval) {
        this.setState({
            ...this.state,
            interval: interval,
            spinner: true,
        });
    }

    hasLoaded(loaded) {
        setTimeout(() => {
            this.setState({
                ...this.state,
                spinner: false,
            });
        }, 500);
    }

    getData(assetID) {
        assetservice
            .getAsset(assetID)
            .then((data) => {
                if (!data.hasOwnProperty('errors')) {
                    this.setState({
                        ...this.state,
                        asset: data.asset,
                        token: data.asset.token,
                        data: data.asset.token.data,
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
                    portfolioservice.getPortfolios(false).then((data) => {
                        data.portfolios.forEach((portfolio) => {
                            if (portfolio.id == this.state.asset.portfolio.id) {
                                return;
                            }
                            var asset = portfolio.assets.filter((asset) => {
                                return asset.token.id == this.state.token.id;
                            });
                            if (asset.length > 0) {
                                this.setState({
                                    portfolios: [
                                        ...this.state.portfolios,
                                        {
                                            name: portfolio.name,
                                            aid: asset[0].id,
                                            balance: asset[0].balance,
                                        },
                                    ],
                                });
                            }
                        });
                    });
                    this.setState({
                        ...this.state,
                        isLoading: false,
                    });
                }
            });
    }

    componentDidMount() {
        if (authservice.checkingPage(this.props)) {
            this.getData(this.props.match.params.id);
        } else {
            this.props.history.push('/login');
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            if (authservice.checkingPage(this.props)) {
                this.setState(this.baseState);

                this.getData(this.props.match.params.id);
            } else {
                this.props.history.push('/login');
            }
        }
    }

    render() {
        return (
            <>
                <UI.PageTitle>
                    <UI.CardHeaderTitle classes="fs-1 me-3">Asset: </UI.CardHeaderTitle>
                    <UI.CardHeaderTitle classes="fs-1 text-secondary">{this.state.token.name}</UI.CardHeaderTitle>
                </UI.PageTitle>
                <UI.PageSubTitle>You have added the following portfolios</UI.PageSubTitle>

                {this.state.isLoading && (
                    <UI.Col classes="col-12 text-center py-4">
                        <UI.Spinner />
                    </UI.Col>
                )}

                {!this.state.isLoading && (
                    <UI.Row classes="mt-4">
                        <UI.Col classes="col-12 col-lg-4 col-xl-3 mb-3 text-center">
                            <UI.Card>
                                <UI.CardBody>
                                    <UI.Row>
                                        <UI.Col classes="col-12 col-md-6 col-lg-12 mb-3">
                                            <UI.Badge classes="bg-darker w-100 py-2 mb-1 lh-1-25">
                                                <span className="fs-4 text-muted">Total Asset Value</span>
                                                <div className="asset-value fs-2 text-white">
                                                    ${(this.state.asset.balance * this.state.data.price).toFixed(2)}
                                                </div>
                                            </UI.Badge>

                                            <UI.Badge classes="bg-dark fs-7 text-white fw-bold py-2 mb-1 w-100">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="me-auto">Balance:</span>
                                                    <UI.FormInputGroup classes="w-125px">
                                                        <UI.Input
                                                            type="text"
                                                            name="balance"
                                                            value={this.state.asset.balance.toString()}
                                                            onChange={this.handleChange}
                                                            classes="form-control-sm bg-darker"
                                                            size="fs-8"
                                                        />
                                                        <div className="input-group-text bg-darker border-0 text-white fs-10 px-2">
                                                            {this.state.token.symbol}
                                                        </div>
                                                    </UI.FormInputGroup>
                                                </div>
                                                <UI.Row>
                                                    <span className="text-danger fst-italic text-center">
                                                        {this.state.errors.map((error, index) => (
                                                            <div key={'update-error-' + index} className="pt-2">
                                                                {error}
                                                            </div>
                                                        ))}
                                                    </span>
                                                </UI.Row>
                                                <UI.Row>
                                                    <span className="text-success fst-italic text-center">
                                                        {this.state.success && (
                                                            <div className="pt-2">{this.state.success}</div>
                                                        )}
                                                    </span>
                                                </UI.Row>
                                            </UI.Badge>

                                            <UI.Badge classes="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-1">
                                                <span className="me-auto">Portfolio:</span>
                                                <span className="d-flex align-items-center">
                                                    {this.state.asset.portfolio.name}
                                                    <NavLink
                                                        exact
                                                        to={'/portfolio/view/' + this.state.asset.portfolio.id}
                                                        className="badge bg-light text-dark ms-2"
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </NavLink>
                                                </span>
                                            </UI.Badge>

                                            <UI.Badge classes="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-3">
                                                <span className="me-auto">Change:</span>
                                                {this.state.data.change > 0 && (
                                                    <>
                                                        <UI.Badge classes="bg-success me-2">
                                                            <UI.Icon icon="bi-caret-up-fill" />$
                                                            {helper.nDecimals(
                                                                Math.abs(
                                                                    (this.state.data.price - this.state.data.prevDay) *
                                                                        this.state.asset.balance,
                                                                ),
                                                                2,
                                                                true,
                                                            )}
                                                        </UI.Badge>
                                                        <UI.Badge classes="bg-success">
                                                            <UI.Icon icon="bi-caret-up-fill" />
                                                            {this.state.data.change.toFixed(2)}%
                                                        </UI.Badge>
                                                    </>
                                                )}
                                                {this.state.data.change < 0 && (
                                                    <>
                                                        <UI.Badge classes="bg-danger me-2">
                                                            <UI.Icon icon="bi-caret-down-fill" />$
                                                            {helper.nDecimals(
                                                                Math.abs(
                                                                    (this.state.data.price - this.state.data.prevDay) *
                                                                        this.state.asset.balance,
                                                                ),
                                                                2,
                                                                true,
                                                            )}
                                                        </UI.Badge>
                                                        <UI.Badge classes="bg-danger">
                                                            <UI.Icon icon="bi-caret-down-fill" />
                                                            {Math.abs(this.state.data.change).toFixed(2)}%
                                                        </UI.Badge>
                                                    </>
                                                )}
                                                {this.state.data.change == 0 && (
                                                    <>
                                                        <UI.Badge classes="bg-secondary me-2">
                                                            <UI.Icon icon="bi-caret-right-fill" />$
                                                            {helper.nDecimals(
                                                                Math.abs(
                                                                    (this.state.data.price - this.state.data.prevDay) *
                                                                        this.state.asset.balance,
                                                                ),
                                                                2,
                                                                true,
                                                            )}
                                                        </UI.Badge>
                                                        <UI.Badge classes="bg-secondary">
                                                            <UI.Icon icon="bi-caret-right-fill" />
                                                            {this.state.data.change.toFixed(2)}%
                                                        </UI.Badge>
                                                    </>
                                                )}
                                            </UI.Badge>

                                            <UI.Badge classes="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-1">
                                                <span className="me-auto">Price:</span>
                                                <span>${helper.nDecimals(this.state.data.price, 2, true)}</span>
                                            </UI.Badge>

                                            <UI.Badge classes="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-1">
                                                <span className="me-auto">Price 24h:</span>
                                                <span>${helper.nDecimals(this.state.data.prevDay, 2, true)}</span>
                                            </UI.Badge>

                                            <UI.Badge classes="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-1">
                                                <span className="me-auto">High price:</span>
                                                <span className="text-success">
                                                    <UI.Icon icon="bi-arrow-up-short text-white" />$
                                                    {helper.nDecimals(this.state.data.high, 2, true)}
                                                </span>
                                            </UI.Badge>

                                            <UI.Badge classes="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-1">
                                                <span className="me-auto">Low price:</span>
                                                <span className="text-danger">
                                                    <UI.Icon icon="bi-arrow-down-short" classes="text-white" />$
                                                    {helper.nDecimals(this.state.data.low, 2, true)}
                                                </span>
                                            </UI.Badge>

                                            <UI.Badge classes="bg-dark d-flex align-items-center fs-7 text-white fw-bold py-2 mb-1">
                                                <span className="me-auto">Volume:</span>
                                                <span>{helper.nDecimals(this.state.data.volume, 2, true)}M</span>
                                            </UI.Badge>
                                        </UI.Col>
                                        <UI.Col classes="col-12 col-md-6 col-lg-12">
                                            <UI.Badge classes="bg-darker w-100 px-2 py-2 mb-1 lh-1-25 text-center fs-4">
                                                In Other portfolios:
                                            </UI.Badge>

                                            {this.state.portfolios.map((portfolio) => (
                                                <UI.Badge
                                                    classes="bg-dark border-dark rounded-3 text-white d-flex align-items-center mb-1 py-2"
                                                    key={portfolio.aid}
                                                >
                                                    <span className="me-auto">{portfolio.name}</span>
                                                    <span>
                                                        <UI.Badge classes="bg-secondary me-2">
                                                            {helper.nDecimals(portfolio.balance, 1, true)}{' '}
                                                            {this.state.token.symbol}
                                                        </UI.Badge>
                                                        <NavLink
                                                            exact
                                                            to={'/asset/' + portfolio.aid}
                                                            className="badge bg-light text-dark"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </NavLink>
                                                    </span>
                                                </UI.Badge>
                                            ))}

                                            {this.state.portfolios.length == 0 && (
                                                <span className="badge text-muted text-center">
                                                    No other portfolios containing this token
                                                </span>
                                            )}
                                        </UI.Col>
                                    </UI.Row>
                                </UI.CardBody>
                            </UI.Card>
                            <NavLink
                                exact
                                to={'/portfolio/view/' + this.state.asset.portfolio.id}
                                className="fs-7 text-muted"
                            >
                                <i className="bi bi-arrow-left me-2"></i>
                                Back to portfolio
                            </NavLink>
                        </UI.Col>
                        <UI.Col classes="col-12 col-lg-8 col-xl-9 mb-3">
                            <UI.Card>
                                <UI.CardBody>
                                    <UI.Badge classes="bg-darker w-100 py-2 lh-1-25 fs-4">Price/Volume Chart</UI.Badge>
                                    <div id="asset-chart" data-symbol={this.state.token.symbol}>
                                        {!this.state.isLoading && (
                                            <>
                                                <figure className="highcharts-figure mb-0">
                                                    {this.state.spinner == true && (
                                                        <div className="w-100 chart-spinner-container asset-spinner">
                                                            <UI.Spinner />
                                                        </div>
                                                    )}
                                                    <AssetChart
                                                        variables={{
                                                            symbol: this.state.token.symbol,
                                                            interval: this.state.interval,
                                                        }}
                                                        loaded={this.hasLoaded}
                                                    />
                                                </figure>
                                                <UI.Col classes="col-12 mt-2 text-center">
                                                    {intervals.map((interval) => (
                                                        <UI.IntervalSelector
                                                            key={interval}
                                                            interval={interval}
                                                            selected={this.state.interval == interval ? 'selected' : ''}
                                                            clickHandler={this.intervalSelector}
                                                        />
                                                    ))}
                                                </UI.Col>
                                            </>
                                        )}
                                    </div>
                                </UI.CardBody>
                            </UI.Card>
                        </UI.Col>
                    </UI.Row>
                )}
            </>
        );
    }
}
