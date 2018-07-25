const initalState = {
  isAuthenticated: false,
  user: {}
};

export default (state = initalState, action) => {
  Object.freeze(state);
  switch(action.type){
    default:
      return state;
  }
};
