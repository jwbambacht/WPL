import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import helper from '../utils/helper';
import authservice from '../services/authservice';
import portfolioservice from '../services/portfolioservice';
import * as UI from './elements/UIElements';
import { PortfolioChart } from './elements/Chart';

const intervals = ['1d', '3d', '7d'];

export default class PortfolioView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            portfolio: {
                id: this.props.match.params.id,
                value: 0,
            },
            variables: {
                symbols: [],
                balances: [],
                interval: '1d',
            },
            spinner: true,
            apiErrors: [],
        };

        this.getPortfolioData = this.getPortfolioData.bind(this);
        this.intervalSelector = this.intervalSelector.bind(this);
        this.hasLoaded = this.hasLoaded.bind(this);
    }

    getPortfolioData() {
        portfolioservice.getPortfolio(this.state.portfolio.id, true).then((data) => {
            if (!data.hasOwnProperty('errors')) {
                if (data.portfolio.assets.filter((asset) => asset.active).length == 0) {
                    this.props.history.push('/portfolio/edit/' + this.state.portfolio.id);
                }

                this.setState({
                    ...this.state,
                    portfolio: data.portfolio,
                    isLoading: false,
                    variables: {
                        ...this.state.variables,
                        symbols: data.portfolio.assets.map((asset) => asset.token.symbol),
                        balances: data.portfolio.assets.map((asset) => asset.balance),
                    },
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
        });
    }

    intervalSelector(e, interval) {
        this.setState({
            ...this.state,
            variables: {
                ...this.state.variables,
                interval: interval,
            },
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

    componentDidMount() {
        if (authservice.checkingPage(this.props)) {
            this.getPortfolioData();
        } else {
            this.props.history.push('/login');
        }
    }

    render() {
        return (
            <>
                <UI.PageTitle>
                    <span className="fw-bold fs-1 me-2">Portfolio: </span>
                    <span className="fs-3">{this.state.portfolio.name}</span>
                </UI.PageTitle>
                <UI.PageSubTitle>You have added the following portfolios</UI.PageSubTitle>

                {this.state.isLoading && (
                    <UI.Col classes="col-12 text-center py-4">
                        <UI.Spinner />
                    </UI.Col>
                )}

                {!this.state.isLoading && (
                    <UI.Row classes="mt-4">
                        <UI.Col classes="col-12 col-md-4 col-xl-4 mb-3 text-center">
                            <UI.Card>
                                <UI.CardBody>
                                    <UI.Badge classes="bg-darker w-100 py-2">
                                        <div className="fs-3 fw-bold portfolio-value">
                                            ${this.state.portfolio.value.toFixed(2)}
                                        </div>
                                        <div className="p-0 fs-7 mt-2 portfolio-changes">
                                            {this.state.portfolio.changePercentage > 0 && (
                                                <>
                                                    <UI.Badge classes="portfolio-change-percentage me-2 bg-success">
                                                        <UI.Icon icon="bi-caret-up-fill" />
                                                        {this.state.portfolio.changePercentage.toFixed(2)}%
                                                    </UI.Badge>
                                                    <UI.Badge classes="portfolio-change-value me-2 bg-success">
                                                        <UI.Icon icon="bi-caret-up-fill" />$
                                                        {this.state.portfolio.changeValue.toFixed(2)}
                                                    </UI.Badge>
                                                </>
                                            )}
                                            {this.state.portfolio.changePercentage < 0 && (
                                                <>
                                                    <span className="badge portfolio-change-percentage me-2 bg-danger">
                                                        <UI.Icon icon="bi-caret-down-fill" />
                                                        {Math.abs(this.state.portfolio.changePercentage).toFixed(2)}%
                                                    </span>
                                                    <span className="badge portfolio-change-value me-2 bg-danger">
                                                        <UI.Icon icon="bi-caret-down-fill" />$
                                                        {Math.abs(this.state.portfolio.changeValue).toFixed(2)}
                                                    </span>
                                                </>
                                            )}
                                            {this.state.portfolio.changePercentage == 0 && (
                                                <>
                                                    <span className="badge portfolio-change-percentage me-2 bg-secondary">
                                                        <UI.Icon icon="bi-caret-right-fill" />
                                                        {Math.abs(this.state.portfolio.changePercentage).toFixed(2)}%
                                                    </span>
                                                    <span className="badge portfolio-change-value me-2 bg-secondary">
                                                        <UI.Icon icon="bi-caret-right-fill" />$
                                                        {Math.abs(this.state.portfolio.changeValue).toFixed(2)}
                                                    </span>
                                                </>
                                            )}
                                            (1D)
                                        </div>
                                    </UI.Badge>
                                    <div id="portfolio-chart">
                                        {this.state.portfolio.value > 0 && (
                                            <>
                                                <figure className="highcharts-figure mb-0">
                                                    {this.state.spinner == true && (
                                                        <div className="w-100 chart-spinner-container portfolio-spinner">
                                                            <UI.Spinner />
                                                        </div>
                                                    )}
                                                    <PortfolioChart
                                                        variables={this.state.variables}
                                                        loaded={this.hasLoaded}
                                                    />
                                                </figure>
                                                <UI.Col classes="col-12 text-center">
                                                    {intervals.map((interval) => (
                                                        <UI.IntervalSelector
                                                            key={interval}
                                                            interval={interval}
                                                            selected={
                                                                this.state.variables.interval == interval
                                                                    ? 'selected'
                                                                    : ''
                                                            }
                                                            clickHandler={this.intervalSelector}
                                                        />
                                                    ))}
                                                </UI.Col>
                                            </>
                                        )}
                                    </div>
                                </UI.CardBody>
                            </UI.Card>
                            <NavLink exact to="/portfolios" className="fs-7 text-muted">
                                <UI.Icon icon="bi-arrow-left" classes="me-2" />
                                Back to all portfolios
                            </NavLink>
                        </UI.Col>
                        <UI.Col classes="col-12 col-md-8 col-xl-8 portfolio-list">
                            <UI.Col classes="col-12 mb-2">
                                <UI.Card classes="bg-dark">
                                    <UI.Row>
                                        <UI.Col classes="col mt-auto mb-auto w-100">
                                            <UI.Row classes="ps-3 py-2">
                                                <UI.Col classes="col col-icon"></UI.Col>
                                                <UI.Col classes="col">
                                                    <UI.Badge classes="bg-darker">Currency</UI.Badge>
                                                </UI.Col>
                                                <UI.Col classes="col">
                                                    <UI.Badge classes="bg-darker">Price/Change</UI.Badge>
                                                </UI.Col>
                                                <UI.Col classes="col d-none d-lg-block">
                                                    <UI.Badge classes="bg-darker">High/Low</UI.Badge>
                                                </UI.Col>
                                                <UI.Col classes="col d-none d-sm-block">
                                                    <UI.Badge classes="bg-darker">Balance/Value</UI.Badge>
                                                </UI.Col>
                                            </UI.Row>
                                        </UI.Col>
                                        <div className="w-56px"></div>
                                    </UI.Row>
                                </UI.Card>
                            </UI.Col>
                            {this.state.portfolio.assets.filter((asset) => asset.active).length == 0 && (
                                <UI.Col classes="col-12 mb-2">
                                    <UI.Card classes="text-center py-2">No assets in portfolio</UI.Card>
                                </UI.Col>
                            )}
                            {this.state.portfolio.assets
                                .sort((a, b) => (a.value < b.value ? 1 : -1))
                                .map(
                                    (asset) =>
                                        asset.active && (
                                            <UI.Col classes="col-12 mb-2 portfolio-row" key={asset.id}>
                                                <UI.Card>
                                                    <UI.Row>
                                                        <UI.Col classes="col mt-auto mb-auto w-100 py-3">
                                                            <UI.Row classes="ps-3">
                                                                <UI.Col classes="col col-icon">
                                                                    <UI.Badge classes="bg-darker p-2">
                                                                        <img
                                                                            src={
                                                                                'http://localhost:8080/CryptFolio/images/icons/' +
                                                                                asset.token.symbol +
                                                                                '.png'
                                                                            }
                                                                            width="32px"
                                                                            height="32px"
                                                                        />
                                                                    </UI.Badge>
                                                                </UI.Col>
                                                                <UI.Col classes="col">
                                                                    <UI.Badge classes="fw-bold">
                                                                        {asset.token.name}
                                                                    </UI.Badge>
                                                                    <br />
                                                                    <UI.Badge classes="text-muted">
                                                                        {asset.token.symbol}
                                                                    </UI.Badge>
                                                                </UI.Col>
                                                                <UI.Col classes="col">
                                                                    <UI.Badge
                                                                        data-symbol={asset.token.symbol}
                                                                        classes="asset-price"
                                                                    >
                                                                        $
                                                                        {helper.nDecimals(
                                                                            asset.token.data.price,
                                                                            2,
                                                                            true,
                                                                        )}
                                                                    </UI.Badge>
                                                                    <br />
                                                                    {asset.token.data.change > 0 && (
                                                                        <UI.Badge
                                                                            data-symbol={asset.token.symbol}
                                                                            classes="asset-change text-success"
                                                                        >
                                                                            <UI.Icon icon="bi-caret-up-fill" />
                                                                            {asset.token.data.change.toFixed(2)}%
                                                                        </UI.Badge>
                                                                    )}
                                                                    {asset.token.data.change < 0 && (
                                                                        <UI.Badge
                                                                            data-symbol={asset.token.symbol}
                                                                            classes="asset-change text-danger"
                                                                        >
                                                                            <UI.Icon icon="bi-caret-down-fill" />
                                                                            {Math.abs(asset.token.data.change).toFixed(
                                                                                2,
                                                                            )}
                                                                        </UI.Badge>
                                                                    )}
                                                                    {asset.token.data.change == 0 && (
                                                                        <UI.Badge
                                                                            data-symbol={asset.token.symbol}
                                                                            classes="asset-change text-white"
                                                                        >
                                                                            <UI.Icon icon="bi-caret-right-fill" />
                                                                            {asset.token.data.change.toFixed(2)}%
                                                                        </UI.Badge>
                                                                    )}
                                                                </UI.Col>
                                                                <UI.Col classes="col d-none d-lg-block">
                                                                    <UI.Icon icon="bi-arrow-up-short text-white" />
                                                                    <UI.Badge
                                                                        data-symbol={asset.token.symbol}
                                                                        classes="asset-high text-success"
                                                                    >
                                                                        $
                                                                        {helper.nDecimals(
                                                                            asset.token.data.high,
                                                                            2,
                                                                            true,
                                                                        )}
                                                                    </UI.Badge>
                                                                    <br />
                                                                    <UI.Icon icon="bi-arrow-down-short text-white" />
                                                                    <UI.Badge
                                                                        data-symbol={asset.token.symbol}
                                                                        classes="asset-low text-danger"
                                                                    >
                                                                        $
                                                                        {helper.nDecimals(
                                                                            asset.token.data.low,
                                                                            2,
                                                                            true,
                                                                        )}
                                                                    </UI.Badge>
                                                                </UI.Col>
                                                                <UI.Col classes="col d-none d-sm-block">
                                                                    <UI.Badge>
                                                                        <span
                                                                            data-symbol={asset.token.symbol}
                                                                            data-balance={asset.balance}
                                                                            className="asset-balance"
                                                                        >
                                                                            {asset.balance}
                                                                        </span>
                                                                        <span className="ps-1">
                                                                            {asset.token.symbol}
                                                                        </span>
                                                                    </UI.Badge>
                                                                    <br />
                                                                    <UI.Badge
                                                                        data-symbol={asset.token.symbol}
                                                                        classes="asset-value"
                                                                    >
                                                                        ${asset.value.toFixed(2)}
                                                                    </UI.Badge>
                                                                </UI.Col>
                                                            </UI.Row>
                                                        </UI.Col>
                                                        <NavLink
                                                            exact
                                                            to={'/asset/' + asset.id}
                                                            className="w-auto ps-2"
                                                        >
                                                            <div className="portfolio-asset-view h-100 d-flex align-items-center text-white fs-2 rounded-0 rounded-end">
                                                                <UI.Icon icon="bi-chevron-right" />
                                                            </div>
                                                        </NavLink>
                                                    </UI.Row>
                                                </UI.Card>
                                            </UI.Col>
                                        ),
                                )}
                            <UI.Col classes="col-12 mb-2">
                                <UI.Row>
                                    <UI.Col classes="col w-100 text-center p-0">
                                        <NavLink
                                            exact
                                            to={'/portfolio/edit/' + this.state.portfolio.id}
                                            className="fs-7 text-muted"
                                        >
                                            <i className="bi bi-pencil-fill me-2"></i>Edit Portfolio
                                        </NavLink>
                                    </UI.Col>
                                </UI.Row>
                            </UI.Col>
                        </UI.Col>
                    </UI.Row>
                )}
            </>
        );
    }
}
