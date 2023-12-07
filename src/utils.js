import axios from 'axios';

const makeRequest = async (url, options) => {
  try {
    const response = await axios(url, options);
    if (response.status === 200) {
      return Promise.resolve(response.data);
    } else {
      return Promise.reject('Invalid response');
    }
  } catch (error) {
    return Promise.reject(error.message);
  }
};

export { makeRequest };
