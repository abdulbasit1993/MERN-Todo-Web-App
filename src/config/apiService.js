import axios from "axios";

// API GET Call
export const getCall = (url) => {
  return axios.get(url);
};

// API POST CALL
export const postCall = (url, data) => {
  return axios.post(url, data);
};

// API PATCH CALL
export const patchCall = (url, data) => {
  return axios.patch(url, data);
};

// API DELETE Call
export const deleteCall = (url) => {
  return axios.delete(url);
};
