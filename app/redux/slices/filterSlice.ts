// filtersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store'; // Ensure you're importing RootState correctly
import { filterCars, resetCars } from './carSlice';

interface PriceFilter {
    operator: 'greater' | 'less';
    value: number;
}

interface FilterState {
    searchTerm: string;
    priceFilter: PriceFilter | null;
    conditionFilter: 'New' | 'Used' | 'Classic' | null;
}

const initialState: FilterState = {
    searchTerm: '',
    priceFilter: null,
    conditionFilter: null,
};

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSearchTerm(state, action: PayloadAction<string>) {
            state.searchTerm = action.payload;
        },
        setPriceFilter(state, action: PayloadAction<PriceFilter | null>) {
            state.priceFilter = action.payload ?? null;
        },
        setConditionFilter(state, action: PayloadAction<'New' | 'Used' | 'Classic' | null>) {
            state.conditionFilter = action.payload ?? null;
        },
        clearFilters(state) {
            state.searchTerm = '';
            state.priceFilter = null;
            state.conditionFilter = null;
        },
        resetAndFilterCars: (state) => {
            // Reset state to initial values
            state.searchTerm = '';
            state.priceFilter = null;
            state.conditionFilter = null;
        },
    },
});

export const updateFilters = (filter: Partial<FilterState>) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const state = getState(); // Retrieve the current state

        console.log('Current filters state:', state.filters);

        // Dispatch actions based on the filter being updated
        dispatch(setSearchTerm(filter.searchTerm ?? state.filters.searchTerm));
        dispatch(setPriceFilter(filter.priceFilter ?? state.filters.priceFilter));
        dispatch(setConditionFilter(filter.conditionFilter ?? state.filters.conditionFilter));

        // Prepare the payload for filterCars
        const filtersPayload = {
            searchTerm: state.filters.searchTerm,
            priceFilter: state.filters.priceFilter,
            conditionFilter: state.filters.conditionFilter,
        };

        // Dispatch the filterCars action with the filtered payload
        dispatch(filterCars({ filters: filtersPayload }));
    };
};

// Create a thunk for resetting filters and fetching cars
export const resetFiltersAndFetchCars = () => {
    return async (dispatch: AppDispatch) => {
        dispatch(resetAndFilterCars()); // Reset filters to initial state
        // Fetch cars after resetting filters
        dispatch(resetCars()); // Assuming you want to fetch all cars
    };
};

// Export actions and reducer
export const { setSearchTerm, setPriceFilter, setConditionFilter, clearFilters, resetAndFilterCars } = filtersSlice.actions;
export default filtersSlice.reducer;

// Selector to access filters from the state
export const selectFilters = (state: RootState) => state.filters; // Ensure state is of type RootState
