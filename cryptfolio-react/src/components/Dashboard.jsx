import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import helper from '../utils/helper';
import authservice from '../services/authservice';
import portfolioservice from '../services/portfolioservice';
import { Spinner } from './elements/UIElements';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            portfolios: [],
            user: authservice.getUserState(),
            token: authservice.getTokenState(),
            isLoading: true,
        };

        this.getPortfolioData = this.getPortfolioData.bind(this);
    }

    getPortfolioData() {
        portfolioservice.getPortfolios(true).then((data) => {
            if (!data.hasOwnProperty('errors')) {
                this.setState({
                    ...this.state,
                    portfolios: data.portfolios,
                    isLoading: false,
                });
            } else {
                window.location.reload();
            }
        });
    }

    componentDidMount() {
        if (authservice.checkingPage(this.props) || authservice.loggedInStatus()) {
            this.getPortfolioData();
        } else {
            this.setState({
                ...this.state,
                isLoading: false,
            });
        }
    }

    render() {
        return (
            <>
                <h1 className="text-white mt-4">Welcome to Cryptfolio, the portfolio tracker for cryptocurrencies!</h1>

                {this.props.loggedIn && (
                    <div className="text-muted mb-2">An overview of your portfolio's is given below.</div>
                )}

                <div className="mt-4 mb-2 row">
                    {this.state.isLoading && (
                        <div className="col-12 text-center py-4">
                            <Spinner />
                        </div>
                    )}

                    {!this.state.isLoading && !this.props.loggedIn && (
                        <>
                            <div className="col-12 col-md-4 d-flex align-items-stretch mb-2">
                                <div className="card bg-lighter rounded-3 text-white p-0 border-0 w-100">
                                    <div className="card-body bg-lighter p-3 fs-2 text-center">
                                        <i className="bi bi bi-archive fs-50pt"></i>
                                        <br />
                                        Easily track and manage your crypto portfolio(s)
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-4 d-flex align-items-stretch mb-2">
                                <div className="card bg-lighter rounded-3 text-white p-0 border-0 w-100">
                                    <div className="card-body bg-lighter p-3 fs-2 text-center">
                                        <i className="bi bi bi-lightbulb fs-50pt"></i>
                                        <br />
                                        Get insights in the market data of your assets
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-4 d-flex align-items-stretch mb-2">
                                <div className="card bg-lighter rounded-3 text-white p-0 border-0 w-100">
                                    <div className="card-body bg-lighter p-3 fs-2 text-center">
                                        <i className="bi bi bi-play-btn fs-50pt"></i>
                                        <br />
                                        Don't wait any longer and start tracking!
                                        <div className="mt-4 row">
                                            <div className="d-flex align-items-center">
                                                <NavLink exact to="/login" className="btn btn-dark p-2 me-1 w-100">
                                                    Login
                                                </NavLink>
                                                <NavLink exact to="/register" className="btn btn-dark p-2 ms-1 w-100">
                                                    Register
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {!this.state.isLoading && this.props.loggedIn && this.state.portfolios.length == 0 && (
                        <div className="col-12 col-md-6">
                            <NavLink exact to="/portfolios" className="text-white">
                                <div className="card bg-lighter rounded-3 text-white p-0 border-lighter p-0">
                                    <div className="card-body bg-lighter p-0 align-middle pt-5 pb-5 text-center">
                                        <div className="fs-1 text-white">
                                            <i className="bi bi-plus-square"></i>
                                        </div>
                                        <br />
                                        Click to add your first portfolio!
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                    )}

                    {!this.state.isLoading &&
                        this.props.loggedIn &&
                        this.state.portfolios.length > 0 &&
                        this.state.portfolios
                            .sort((a, b) => (a.value < b.value ? 1 : -1))
                            .map((portfolio) => (
                                <div className="col-12 col-md-6 mb-4" key={portfolio.id}>
                                    <div className="card bg-lighter rounded-3 text-white p-0 border-lighter portfolio">
                                        <div className="card-header bg-lighter d-flex justify-content-between fs-3">
                                            <span className="fw-bold">{portfolio.name}</span>
                                            <div className="d-flex align-items-center">
                                                <span className="portfolio-value">${portfolio.value.toFixed(2)}</span>

                                                {portfolio.changePercentage > 0 && (
                                                    <span className="badge portfolio-change-percentage ms-3 fs-8 text-white bg-success">
                                                        <i className="bi bi-caret-up-fill"></i>
                                                        {Math.abs(portfolio.changePercentage).toFixed(2)}%
                                                    </span>
                                                )}
                                                {portfolio.changePercentage < 0 && (
                                                    <span className="badge portfolio-change-percentage ms-3 fs-8 text-white bg-danger">
                                                        <i className="bi bi-caret-down-fill"></i>
                                                        {Math.abs(portfolio.changePercentage).toFixed(2)}%
                                                    </span>
                                                )}
                                                {portfolio.changePercentage == 0 && (
                                                    <span className="badge portfolio-change-percentage ms-3 fs-8 text-white bg-secondary">
                                                        <i className="bi bi-caret-right-fill"></i>
                                                        {Math.abs(portfolio.changePercentage).toFixed(2)}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="card-body bg-lighter p-0">
                                            <ul className="list-group list-group-flush bg-lighter portfolio-list">
                                                {portfolio.assets
                                                    .sort((a, b) => (a.order > b.order ? 1 : -1))
                                                    .filter((asset) => asset.active)
                                                    .map(
                                                        (asset, index) =>
                                                            index <= 2 && (
                                                                <li
                                                                    key={asset.id}
                                                                    className="list-group-item bg-lighter text-white portfolio-row"
                                                                >
                                                                    <div className="row">
                                                                        <div className="col-12 d-flex justify-content-between">
                                                                            <span>{asset.token.name}</span>
                                                                            <span>
                                                                                <span className="badge asset-price bg-success me-1">
                                                                                    $
                                                                                    {helper.nDecimals(
                                                                                        asset.token.data.price,
                                                                                        2,
                                                                                        true,
                                                                                    )}
                                                                                </span>
                                                                                <span className="badge asset-balance bg-info me-1">
                                                                                    {helper.nDecimals(
                                                                                        asset.balance,
                                                                                        2,
                                                                                        true,
                                                                                    )}{' '}
                                                                                    {asset.token.symbol}
                                                                                </span>
                                                                                <NavLink
                                                                                    exact
                                                                                    to={'/asset/' + asset.id}
                                                                                    className="badge bg-light text-dark"
                                                                                >
                                                                                    <i className="bi bi-eye"></i>
                                                                                </NavLink>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ),
                                                    )}
                                                <li className="list-group-item bg-lighter text-muted d-flex justify-content-between fs-7 ">
                                                    <NavLink
                                                        exact
                                                        to={'/portfolio/edit/' + portfolio.id}
                                                        className="me-auto text-muted"
                                                    >
                                                        <i className="bi bi-pencil-fill me-2"></i>Edit
                                                    </NavLink>
                                                    <span className="me-auto">
                                                        {portfolio.assets.length} assets in total
                                                    </span>
                                                    <NavLink
                                                        exact
                                                        to={'/portfolio/view/' + portfolio.id}
                                                        className="text-muted"
                                                    >
                                                        Open
                                                        <i className="bi bi-arrow-right ms-2"></i>
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                </div>
            </>
        );
    }
}
