/* eslint-disable*/

import { axiosInstance } from '../utils/axiosInstance';

export async function loginUser(dispatch, loginPayload) {
  try {
    dispatch({ type: 'REQUEST_LOGIN' });
    let response = await axiosInstance.post('/api/user/login', loginPayload);

    console.log('RES', response);
    if (response.data.data) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.data });
      localStorage.setItem('currentUser', JSON.stringify(response.data.data));
      return response;
    }

    //dispatch({ type: 'LOGIN_ERROR', error: data.errors[0] });
    return;
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', error: error });
  }
}

export async function logout(dispatch) {
  dispatch({ type: 'LOGOUT' });
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
}
