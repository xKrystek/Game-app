import { useState } from "react";
import SignIn from "./sign-in";
import SignUp from "./sign-up";

function Authpage() {
  const [loggingView, setLoggingView] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {loggingView ? <SignIn /> : <SignUp />}
      <button
        className="lg:w-xl sm:w-sm md:w-md mt-3"
        onClick={() => setLoggingView(!loggingView)}
      >
        {loggingView ? "Go to Sign up" : "Go to Sign in"}
      </button>
    </div>
  );
}

export default Authpage;
