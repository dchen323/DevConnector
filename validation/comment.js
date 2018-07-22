import Validator from 'validator';
import isEmpty from './is-empty';

const validateCommentInput = (data) => {
  let errors = {};


  data.text = !isEmpty(data.text) ? data.text : '';

  if(!Validator.isLength(data.text, { min: 2, max: 160})){
    errors.text = 'Post must be between 2 and 160 characters';
  }

  if(Validator.isEmpty(data.text)){
    errors.text = 'Text field is required';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateCommentInput;
