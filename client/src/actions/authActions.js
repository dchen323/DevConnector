export const TEST_DISPATCH = "TEST_DISPATCH";

//Register User
export const registerUser = (userData) => {
  return({
    type: TEST_DISPATCH,
    payload: userData
  });
};
