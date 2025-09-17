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

// export const callUserAuthApi = async () => {
//   try {
//     const response = await axios.get("http://localhost:5000/api/auth", {
//       withCredentials: true,
//     });

//     return response?.data;
//   } catch (e) {
//     console.log(e);
//     return e;
//   }
// };

export const callUserAuthApi = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/auth", {
  withCredentials: true,
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

    return response?.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const callLogoutUser = async () => {
  try{
    const response = await axios.post("http://localhost:5000/api/logout", {}, {
      withCredentials: true,
    });
    console.log("logged Out");
    console.log(response, "from callLogoutUser");
    return response?.data;
  }  catch (e){
    console.log(e);
    return e;
  }
}