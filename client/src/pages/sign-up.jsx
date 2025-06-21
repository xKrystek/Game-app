import { useForm } from "react-hook-form";
import { signUpControls } from "../config";
import CommonForm from "../components/common-form";

function SignUp() {
  const formData = useForm({
    defaultValues: {
      name: "",
      label: "",
      placeholder: "",
      value: "",
      type: "",
      email: "",
      password: "",
    },
  });

  function handleSubmit(getData) {
    console.log(getData);
  }

  return (
    <CommonForm
      formControls={signUpControls}
      form={formData}
      buttonText={"Sign Up"}
      handleSubmit={handleSubmit}
    />
  );
}

export default SignUp;
