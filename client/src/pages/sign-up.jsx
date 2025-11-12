import { useForm } from 'react-hook-form';
import { signUpControls } from '../config/formConfig';
import CommonForm from '../components/common-form/commonForm';
import { callRegisterUserApi } from '../services/apiCalls';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const formData = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function handleSubmit(getData) {
    try {
      const response = await callRegisterUserApi(getData);
      if (response?.success) {
        formData.reset();
        setError(null); // Clear error if any
        navigate('/');
      } else {
        setError(response.response.data.message || 'Something went wrong.');
      }
    } catch (e) {
      setError(e.message); // This will now show your error message
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <CommonForm
        formControls={signUpControls}
        form={formData}
        buttonText={'Sign Up'}
        handleSubmit={handleSubmit}
      />
      {error ? <p className="text-center mt-2">{error}</p> : null}
    </div>
  );
}

export default SignUp;
