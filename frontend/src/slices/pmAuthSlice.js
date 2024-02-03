import {createSlice} from '@reduxjs/toolkit'



const initialState = {
    pmInfo: localStorage.getItem('pmInfo') ? JSON.parse(localStorage.getItem('pmInfo')) : null
}

const pmAuthSlice = createSlice({
    
    name: 'pmAuth',
    initialState,
    reducers:{
        setPmCredentials:(state,action)=>{
            state.pmInfo = action.payload;
            localStorage.setItem('pmInfo', JSON.stringify(action.payload))
        },
        pmLogout:(state,action)=>{
            
            state.pmInfo = null;
            localStorage.removeItem('pmInfo')
             
        }
    }
})

export const { setPmCredentials, pmLogout } = pmAuthSlice.actions

export default pmAuthSlice.reducer