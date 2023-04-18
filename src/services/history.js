import axios from "axios";
import constants from "../utils/constants";

// eslint-disable-next-line import/no-anonymous-default-export
export default class {
  static getByUserId = async (token, obj) => {
    let result = { data: null, error: null };
    const headers = {};
    headers[constants.TOKEN_NAME] = token;

    await axios
      .post(`${process.env.REACT_APP_API_URL}/history/user`, obj, {
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
