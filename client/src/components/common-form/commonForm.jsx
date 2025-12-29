import { useState } from 'react';
import { Controller } from 'react-hook-form';

function CommonForm({ formControls = [], form, buttonText, handleSubmit }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="lg:w-xl sm:w-sm md:w-md w-50px h-[300px] grid grid-cols-1"
    >
      {formControls.map((controlItem, index) =>
        controlItem.componentType === 'input' ? (
          <div className="flex flex-col" key={index}>
            <label htmlFor={controlItem.name}>{controlItem.label}</label>
            <Controller
              control={form.control}
              name={controlItem.name}
              render={({ field }) => (
                <input
                  id={controlItem.name}
                  type={!showPassword ? controlItem.type : 'text'}
                  name={controlItem.name}
                  placeholder={controlItem.placeholder}
                  onChange={field.onChange}
                  value={field.value}
                  className="border-2 border-gray-500 rounded-[6px] p-2"
                />
              )}
            ></Controller>
            {controlItem.name === 'password' ? (
              <div className="flex flex-row self-center mt-5">
                <label htmlFor="blabla" className="mr-2">
                  Show Password
                </label>
                <input
                  type="checkbox"
                  name="blabla"
                  id="blabla"
                  onChange={() => setShowPassword(!showPassword)}
                />
              </div>
            ) : null}
          </div>
        ) : null
      )}
      <button
        type="submit"
        className="text-amber-50 min-w-[7ch] w-1/2 max-h-14 justify-self-center"
      >
        {buttonText || 'Submit'}
      </button>
    </form>
  );
}

export default CommonForm;
