import { GET_ERRORS } from '../actions/authActions';

const initalState = {
  isAuthenticated: false,
  user: {}
};

export default (state = initalState, action) => {
  Object.freeze(state);
  switch(action.type){
    case GET_ERRORS:
      return action.payload;
    default:
      return state;
  }
};
