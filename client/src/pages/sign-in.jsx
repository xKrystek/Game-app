import { useForm } from 'react-hook-form';
import { signInControls } from '../config/formConfig';
import CommonForm from '../components/common-form/commonForm';
import { callLoginUserApi } from '../services/apiCalls';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const formData = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function handleSubmit(getData) {
    try {
      const response = await callLoginUserApi(getData);
      if (response?.success) {
        formData.reset();
        setError(null); // Clear error if any
        navigate('/games');
      } else {
        setError(response?.response?.data.message || 'Something went wrong.');
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
        buttonText={'Sign in'}
        handleSubmit={handleSubmit}
      />
      {error ? <p className="text-center mt-2">{error}</p> : null}
    </div>
  );
}

export default SignIn;
