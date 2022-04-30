import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

import { useHttp } from '../../hooks/http.hook';

// const initialState = {
//     filters: [],
//     filtersLoadingStatus: 'idle',
//     activeFilter: 'all'
// }

const filtersAdapter = createEntityAdapter()

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
})

export const fetchFiltersFetching = createAsyncThunk(
    'filters/fetchFiltersFetching',
    () => {
        const { request } = useHttp()
        return request("http://localhost:3001/filters")

    }
)

const heroesFiltersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFiltersFetching.pending, state => { state.filtersLoadingStatus = 'loading' })
            .addCase(fetchFiltersFetching.fulfilled, (state, action) => {
                // state.filters = action.payload
                filtersAdapter.setAll(state, action.payload)
                state.filtersLoadingStatus = 'idle'
            })
            .addCase(fetchFiltersFetching.rejected, (state) => {
                state.filtersLoadingStatus = 'error'
            })
            .addDefaultCase(() => { })
    }
})


const { actions, reducer } = heroesFiltersSlice

export default reducer


export const {selectAll} = filtersAdapter.getSelectors(state => state.filters)

export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    activeFilterChanged
} = actions