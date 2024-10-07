// store.js
import { createStore } from 'redux';

const initialState = {
  targetAmount: '',
  inputs: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TARGET_AMOUNT':
      return { ...state, targetAmount: action.payload };
    case 'UPDATE_INPUTS':
      return { ...state, inputs: action.payload };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
