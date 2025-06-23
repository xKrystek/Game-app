import axios from "axios";

export const registerUser = async (formData) => {
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
