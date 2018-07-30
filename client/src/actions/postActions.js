import axios from "axios";

export const POST_LOADING = "POST_LOADING";
export const GET_POSTS = "GET_POSTS";
export const GET_POST = "GET_POST";
export const ADD_POST = "ADD_POST";
export const DELETE_POST = "DELETE_POST";
export const GET_ERRORS = "GET_ERRORS";

//Add Post
export const addPost = postData => dispatch => {
  axios
    .post("/api/posts", postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
