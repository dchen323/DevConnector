import { GET_ERRORS } from "../actions/authActions";
import { CLEAR_ERRORS } from "../actions/postActions";

const initalState = {};

export default (state = initalState, action) => {
  Object.freeze(state);
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
};
