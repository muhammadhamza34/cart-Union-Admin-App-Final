import { userConstants } from "../actions/constants";

const initState = {
  error: null,
  message: "",
  loading: false,
  users : []
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initState, action) => {
  console.log(action);
  // eslint-disable-next-line default-case
  switch (action.type) {
    case userConstants.USER_REGISTER_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case userConstants.USER_REGISTER_SUCCESS:
      state = {
        ...state,
        loading: false,
        message: action.payload.message,
      };
      break;
    case userConstants.USER_REGISTER_FAILURE:
    state = {
      ...state,
      loading:false,
      error:action.payload.error
    };
    case userConstants.FETCH_User_SUCCESS:
    state = {
      ...state,
      users: action.payload.User,
    };
      break;
  }
  return state;
};
