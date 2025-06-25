import { useForm } from "react-hook-form";
import { signInControls } from "../config";
import CommonForm from "../components/common-form";
import { callLoginUserApi } from "../services/index";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const formData = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);

  const navigate = useNavigate();

  async function handleSubmit(getData) {
    try {
      const response = await callLoginUserApi(getData);
      if (response?.success) {
        formData.reset();
        setDone(response.message);
        setError(null); // Clear error if any
        navigate("/tic-tac-toe");
      } else {
        setError(response.response.data.message || "Something went wrong.");
      }
    } catch (e) {
      setError(e.message); // This will now show your error message
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <CommonForm
        formControls={signInControls}
        form={formData}
        buttonText={"Sign in"}
        handleSubmit={handleSubmit}
      />
      {error ? (
        <p className="text-center mt-2">{error}</p>
      ) : (
        done && <p className="text-center mt-2">{done}</p>
      )}
    </div>
  );
}

export default SignIn;
