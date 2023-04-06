import axios from "axios";
import constants from "../utils/constants";

// eslint-disable-next-line import/no-anonymous-default-export
export default class {
  static get = async (token, obj) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/payments/all`, obj, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static getById = async (token, obj) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/payments/user`, obj, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static getSum = async (token) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;

    await axios
      .get(`${process.env.REACT_APP_API_URL}/payments`, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static create = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/names`, data, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static createMany = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;
    await axios
      .post(`${process.env.REACT_APP_API_URL}/names/many`, data, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static update = async (token, data) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;
    await axios
      .put(
        `${process.env.REACT_APP_API_URL}/names/${data.id}`,
        { name: data.name },
        {
          headers: headers,
        }
      )
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };

  static delete = async (token, userId) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;

    await axios
      .delete(`${process.env.REACT_APP_API_URL}/names/${userId}`, {
        headers: headers,
      })
      .then((resp) => {
        if (resp.status === 200) {
          result.data = resp.data;
        }
      })
      .catch((err) => {
        result.error = err.response.data;
      });

    return result;
  };
}
