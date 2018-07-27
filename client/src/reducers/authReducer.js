import { SET_CURRENT_USER } from "../actions/authActions";
import isEmpty from "../validation/isEmpty";

const initalState = {
  isAuthenticated: false,
  user: {}
};

export default (state = initalState, action) => {
  Object.freeze(state);
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
};
