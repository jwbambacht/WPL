import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import helper from '../utils/helper';
import authservice from '../services/authservice';
import portfolioservice from '../services/portfolioservice';
import * as UI from './elements/UIElements';

export default class Portfolios extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: authservice.getUserState(),
            token: authservice.getTokenState(),
            portfolios: [],
            total_value: 0,
            total_cost: 0,
            portfolio_name: '',
            errors: [],
            isLoading: true,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.handleErrors = this.handleErrors.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleClick(e) {
        e.preventDefault();
        portfolioservice.addPortfolio(this.state.portfolio_name, this.handleErrors, this.handleSuccess);
    }

    handleErrors(errors) {
        if (errors.length != 0) {
            this.setState({
                errors: errors.map(function (error) {
                    return error.error;
                }),
            });
        }
    }

    handleSuccess(portfolioID) {
        this.setState({
            errors: [],
        });

        this.props.history.push('/portfolio/edit/' + portfolioID);
    }

    getPortfolioData() {
        portfolioservice.getPortfolios(false).then((data) => {
            if (!data.hasOwnProperty('errors')) {
                if (data.portfolios.length > 0) {
                    const value = data.portfolios.map((portfolio) => portfolio.value).reduce((a, b) => a + b);
                    const cost = data.portfolios.map((portfolio) => portfolio.cost).reduce((a, b) => a + b);
                    this.setState({
                        portfolios: data.portfolios,
                        total_value: value,
                        total_cost: cost,
                    });
                }
                this.setState({
                    ...this.state,
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
            this.getPortfolioData();
        } else {
            this.props.history.push('/login');
        }
    }

    render() {
        return (
            <>
                <UI.PageTitle>Portfolio Overview</UI.PageTitle>
                <UI.PageSubTitle>You have added the following portfolios</UI.PageSubTitle>
                <UI.Row classes="mt-4">
                    {this.state.isLoading && (
                        <UI.Col classes="col-12 text-center py-4">
                            <UI.Spinner />
                        </UI.Col>
                    )}
                    {!this.state.isLoading && (
                        <UI.Col classes="col-12 col-md-5 col-lg-4 mb-3">
                            {this.state.portfolios.length > 0 && (
                                <UI.Card classes="mb-3">
                                    <UI.CardBody>
                                        <UI.Badge classes="bg-darker w-100 py-2 mb-3 lh-1-25">
                                            <span className="fs-4 text-secondary">Total Value</span>
                                            <div className="portfolios-value fs-2 text-white">
                                                ${this.state.total_value.toFixed(2)}
                                            </div>
                                        </UI.Badge>
                                        <UI.Badge classes="d-flex align-items-center fs-7 fw-bold">
                                            <span className="me-auto">Total Cost:</span>
                                            <span>${this.state.total_cost.toFixed(2)}</span>
                                        </UI.Badge>
                                        <UI.Badge classes="d-flex align-items-center fs-7 fw-bold">
                                            <span className="me-auto">Total Profit:</span>
                                            <span>${(this.state.total_value - this.state.total_cost).toFixed(2)}</span>
                                        </UI.Badge>
                                    </UI.CardBody>
                                </UI.Card>
                            )}

                            <UI.Card>
                                <UI.CardHeader>
                                    <UI.CardHeaderTitle>Create Portfolio</UI.CardHeaderTitle>
                                </UI.CardHeader>

                                <UI.CardBody>
                                    <UI.FormRow>
                                        <UI.FormColLabel>
                                            <UI.FormLabel>Name</UI.FormLabel>
                                        </UI.FormColLabel>
                                        <UI.FormColInput>
                                            <UI.Input
                                                type="text"
                                                name="portfolio_name"
                                                value={this.state.portfolio_name}
                                                onChange={this.handleChange}
                                                classes="btn-dark w-100"
                                            />
                                        </UI.FormColInput>
                                    </UI.FormRow>
                                    <UI.FormRow classes="text-danger fst-italic">
                                        <UI.Col classes="col-12">
                                            {this.state.errors.map((error, index) => (
                                                <div key={'new-portfolio-error-' + index}>{error}</div>
                                            ))}
                                        </UI.Col>
                                    </UI.FormRow>
                                    <UI.FormRow>
                                        <UI.Col classes="col-12">
                                            <UI.FormRow>
                                                <UI.Col classes="col-12 text-end">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-sm btn-success button"
                                                        onClick={this.handleClick}
                                                    >
                                                        Continue <UI.Icon icon="bi bi-arrow-right" />
                                                    </button>
                                                </UI.Col>
                                            </UI.FormRow>
                                        </UI.Col>
                                    </UI.FormRow>
                                </UI.CardBody>
                            </UI.Card>
                        </UI.Col>
                    )}
                    {!this.state.isLoading && this.state.portfolios.length > 0 && (
                        <UI.Col classes="col-12 col-md-7 col-lg-8">
                            {this.state.portfolios.map((portfolio) => (
                                <UI.Col classes="col-12 mb-3" key={portfolio.id}>
                                    <UI.Card>
                                        <UI.Row classes="portfolio">
                                            <UI.Col classes="col mt-auto mb-auto ps-3 py-3 pe-0">
                                                <UI.FormRow classes="ps-3 py-2">
                                                    <UI.Col classes="col-12">
                                                        <div className="fs-4 d-flex">
                                                            <span className="fw-bold me-auto d-flex align-items-center">
                                                                {portfolio.name}
                                                                {portfolio.changePercentage > 0 && (
                                                                    <UI.Badge classes="portfolio-change-percentage ms-2 fs-8 text-white bg-success">
                                                                        <UI.Icon icon="bi-caret-up-fill" />
                                                                        {Math.abs(portfolio.changePercentage).toFixed(
                                                                            2,
                                                                        )}
                                                                        %
                                                                    </UI.Badge>
                                                                )}
                                                                {portfolio.changePercentage < 0 && (
                                                                    <UI.Badge classes="portfolio-change-percentage ms-2 fs-8 text-white bg-danger">
                                                                        <UI.Icon icon="bi-caret-down-fill" />
                                                                        {Math.abs(portfolio.changePercentage).toFixed(
                                                                            2,
                                                                        )}
                                                                        %
                                                                    </UI.Badge>
                                                                )}
                                                                {portfolio.changePercentage == 0 && (
                                                                    <UI.Badge classes="portfolio-change-percentage ms-2 fs-8 text-white bg-secondary">
                                                                        <UI.Icon icon="bi-caret-right-fill" />
                                                                        {Math.abs(portfolio.changePercentage).toFixed(
                                                                            2,
                                                                        )}
                                                                        %
                                                                    </UI.Badge>
                                                                )}
                                                            </span>
                                                            <div className="portfolio-value">
                                                                ${portfolio.value.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </UI.Col>
                                                    <UI.Col classes="col-12">
                                                        {portfolio.assets.length > 0 &&
                                                            portfolio.assets.map(
                                                                (asset) =>
                                                                    asset.active && (
                                                                        <span
                                                                            className="badge bg-darker portfolio-row me-2"
                                                                            key={asset.id}
                                                                        >
                                                                            {asset.token.symbol}
                                                                        </span>
                                                                    ),
                                                            )}
                                                    </UI.Col>
                                                </UI.FormRow>
                                            </UI.Col>
                                            <NavLink
                                                exact
                                                to={'/portfolio/view/' + portfolio.id}
                                                className="w-auto ps-2"
                                            >
                                                <div className="portfolio-asset-view h-100 d-flex align-items-center text-white fs-2 rounded-0 rounded-end">
                                                    <UI.Icon icon="bi-chevron-right" />
                                                </div>
                                            </NavLink>
                                        </UI.Row>
                                    </UI.Card>
                                </UI.Col>
                            ))}
                        </UI.Col>
                    )}
                </UI.Row>
            </>
        );
    }
}
