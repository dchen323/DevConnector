import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwtDecode from 'jwt-decode';

export const GET_ERRORS = 'GET_ERRORS';
export const SET_CURRENT_USER ='SET_CURRENT_USER';

//Register User
export const registerUser = (userData, history) => dispatch => {

  axios.post('/api/users/register', userData)
    .then(res => history.push('/login') )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login - Get User Token
export const loginUser = (userData) => dispatch => {
  axios.post('/api/users/login', userData)
    .then(res => {
      //Save to local storage
      const { token } = res.data;
      //Set token to local storage
      localStorage.setItem('jwtToken', token);
      //Set token to auth header
      setAuthToken(token);
      //Decode token to get user data
      const decoded = jwtDecode(token);
      //Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Create login user function
export const setCurrentUser = (decoded) => {
  return({
    type: SET_CURRENT_USER,
    payload: decoded
  });
};
