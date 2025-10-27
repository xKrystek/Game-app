import axios from "axios";

const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname; // 'localhost' or '192.168.1.173'
    return `http://${host}:5000`;
  }
  // fallback
  return 'http://localhost:5000';
};

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

// export const callLoginUserApi = async (formData) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:5000/api/login",
//       formData,
//       {
//         withCredentials: true,
//       }
//     );

//     return response?.data;
//   } catch (e) {
//     console.log(e);
//     return e;
//   }
// };

// export const callUserAuthApi = async () => {
//   try {
//     const response = await axios.get("http://localhost:5000/api/auth", {
//   withCredentials: true,
//   headers: {
//     "Cache-Control": "no-cache, no-store, must-revalidate",
//     Pragma: "no-cache",
//     Expires: "0",
//   },
// });

//     return response?.data;
//   } catch (e) {
//     console.log(e);
//     return e;
//   }
// };

const BACKEND_URL = getBackendUrl();

export const callLoginUserApi = async (formData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/login`,
      formData,
      { withCredentials: true }
    );
    return response?.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const callUserAuthApi = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/auth`, {
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
    const response = await axios.post(`${BACKEND_URL}/api/logout`, {}, {
      withCredentials: true,
    });
    sessionStorage.removeItem("username");
    location.reload();
    console.log("logged Out");
    console.log(response, "from callLogoutUser");
    return response?.data;
  }  catch (e){
    console.log(e);
    return e;
  }
}