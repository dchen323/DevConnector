import { TEST_DISPATCH } from '../actions/authActions';

const initalState = {
  isAuthenticated: false,
  user: {}
};

export default (state = initalState, action) => {
  Object.freeze(state);
  switch(action.type){
    case TEST_DISPATCH:
      return {
        ...state,
        user: action.payload
      }
    default:
      return state;
  }
};
