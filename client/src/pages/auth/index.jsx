import { useState } from "react";
import SignIn from "../sign-in";
import SignUp from "../sign-up";

function Authpage() {
  const [loggingView, setLoggingView] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center">
      {loggingView ? <SignIn /> : <SignUp />}
      <button
        className="w-[300px] mt-3"
        onClick={() => setLoggingView(!loggingView)}
      >
        {loggingView ? "Go to Sign up" : "Go to Sign in"}
      </button>
    </div>
  );
}

export default Authpage;
