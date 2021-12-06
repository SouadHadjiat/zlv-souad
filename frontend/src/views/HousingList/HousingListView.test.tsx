import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';


import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import applicationReducer from '../../store/reducers/applicationReducers';
import HousingListView from './HousingListView';
import config from '../../utils/config';
import authService from '../../services/auth.service';
import { initialFilters } from '../../store/reducers/housingReducer';
import { genCampaign, genHousing, genPaginatedResult } from '../../../test/fixtures.test';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { ownerKindOptions } from '../../models/HousingFilters';

describe('housing view', () => {

    let store: any;

    beforeEach(() => {
        fetchMock.resetMocks();
        store = createStore(
            applicationReducer,
            applyMiddleware(thunk)
        );
    });

    test('should only show owner filters initially', () => {
        fetchMock.mockResponse(JSON.stringify([]), { status: 200 });
        render(
            <Provider store={store}>
                <Router history={createMemoryHistory()}>
                    <HousingListView/>
                </Router>
            </Provider>
        );
        const ownerFiltersElement = screen.getByTestId('owner-filters');
        const additionalFiltersElement = screen.getByTestId('additional-filters');
        expect(ownerFiltersElement).toBeInTheDocument();
        expect(additionalFiltersElement).not.toBeVisible();
    });

    test('should enable to show and hide additional filters ', () => {
        fetchMock.mockResponse(JSON.stringify([]), { status: 200 });
        render(
            <Provider store={store}>
                <Router history={createMemoryHistory()}>
                    <HousingListView/>
                </Router>
            </Provider>
        );
        const additionalFiltersElement = screen.getByTestId('additional-filters');
        const additionalFiltersButton = screen.getByTestId('additional-filters-button');

        fireEvent.click(additionalFiltersButton)
        expect(additionalFiltersElement).toBeVisible();

        fireEvent.click(additionalFiltersButton)
        expect(additionalFiltersElement).not.toBeVisible();
    });

    test('should filter', async () => {

        fetchMock.mockResponse(JSON.stringify([]), { status: 200 });

        render(
            <Provider store={store}>
                <Router history={createMemoryHistory()}>
                    <HousingListView/>
                </Router>
            </Provider>
        );

        const ownerKindCheckboxes = screen.queryAllByTestId('type-checkbox-group')[0].querySelectorAll('input');

        act(() => { fireEvent.click(ownerKindCheckboxes[0]) } )

        expect(fetchMock).toHaveBeenCalledWith(
            `${config.apiEndpoint}/api/housing`, {
                method: 'POST',
                headers: { ...authService.authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ filters: { ...initialFilters, ownerKinds: [ownerKindOptions[0].value]}, page: 1, perPage: 20}),
            });
    });

    test('should search', async () => {

        fetchMock.mockResponse(JSON.stringify([]), { status: 200 });

        render(
            <Provider store={store}>
                <Router history={createMemoryHistory()}>
                    <HousingListView/>
                </Router>
            </Provider>
        );

        const searchInputElement = screen.getByTestId('search-input');
        const searchFormElement = screen.getByTestId('search-form');
        fireEvent.change(searchInputElement, {target: {value: 'my search'}});

        act(() => { fireEvent.submit(searchFormElement) });

        expect(fetchMock).toHaveBeenCalledWith(
            `${config.apiEndpoint}/api/housing`, {
            method: 'POST',
            headers: { ...authService.authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ filters: {...initialFilters, query: 'my search'}, page: 1, perPage: 20}),
        });
    });

    test('should display an alert message on creating campaign if no housing are selected', async () => {

        const housing = genHousing();
        const campaign = genCampaign();
        const paginated = genPaginatedResult([housing]);

        fetchMock.doMockIf('http://localhost:3001/api/housing', 'tiuiyiyi');
        fetchMock.doMockIf(
            `${config.apiEndpoint}/api/campaigns`,
            JSON.stringify([campaign]), { status: 200 });

        const history = createMemoryHistory();
        render(<Provider store={store}><Router history={history}><HousingListView/></Router></Provider>);

        const createCampaignButton = screen.getByTestId('create-campaign-button');
        const noHousingAlert = await screen.findByTestId('no-housing-alert');

        fireEvent.click(createCampaignButton);

        expect(noHousingAlert).toBeInTheDocument();
    });

    test('should enable the creation of the campaign when at least a housing is selected', async () => {

        const housing = genHousing();

        fetchMock.doMockIf(
            `${config.apiEndpoint}/api/housing`,
            JSON.stringify([housing]), { status: 200 });

        const history = createMemoryHistory();
        render(<Provider store={store}><Router history={history}><HousingListView/></Router></Provider>);

        const createCampaignButton = await screen.findByTestId('create-campaign-button');
        const housing1Element = await screen.findByTestId('housing-check-' + housing.id);
        const housing1CheckboxElement = housing1Element.querySelector('input[type="checkbox"]') as HTMLInputElement;

        fireEvent.click(housing1CheckboxElement);

        expect(createCampaignButton).toBeEnabled();

        fireEvent.click(createCampaignButton);

        const campaignCreationModal = screen.getByTestId('campaign-creation-modal');

        expect(campaignCreationModal).toBeInTheDocument();

    });

});
