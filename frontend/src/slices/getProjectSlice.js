import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projectDetails: null,
};

const getProjectSlice = createSlice({
  name: 'getProject',
  initialState,
  reducers: {
    setProjectDetails: (state, action) => {
      state.projectDetails = action.payload;
    },
    clearProjectDetails: (state) => {
      state.projectDetails = null;
    },
  },
});

export const { setProjectDetails, clearProjectDetails } = getProjectSlice.actions;

export default getProjectSlice.reducer;
