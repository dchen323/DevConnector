import axios from 'axios';
export const GET_ERRORS = 'GET_ERRORS';

//Register User
export const registerUser = (userData) => dispatch => {

  axios.post('/api/users/register', userData)
    .then(res => console.log(res) )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
