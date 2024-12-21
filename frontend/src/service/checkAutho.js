import axios from "axios";
let backendURL = import.meta.env.VITE_BACKEND_URL;

export const checkAutho = async () => {
  try {
    const userResponse = await axios.get(
      `${backendURL}/users/yes/authenticate`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return { loading: false, user: userResponse.data };
  } catch (error) {
    console.error(error);
    return { loading: false, error };
  }
};
