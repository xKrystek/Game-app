import axios from "axios";

export const callRegisterUserApi = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/register",
      formData,
      {
        withCredentials: true,
      }
    );

    return response?.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const callLoginUserApi = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/login",
      formData,
      {
        withCredentials: true,
      }
    );

    return response?.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const callUserAuthApi = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/auth", {
      withCredentials: true,
    });

    return response?.data;
  } catch (e) {
    console.log(e);
  }
};
