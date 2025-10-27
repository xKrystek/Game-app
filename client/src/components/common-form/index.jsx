import { Controller } from 'react-hook-form';

function CommonForm({ formControls = [], form, buttonText, handleSubmit }) {
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
                  type={controlItem.type}
                  name={controlItem.name}
                  placeholder={controlItem.placeholder}
                  onChange={field.onChange}
                  value={field.value}
                  className="border-2 border-gray-500 rounded-[6px] p-2"
                />
              )}
            ></Controller>
          </div>
        ) : null
      )}
      <button type="submit" className="text-amber-50">
        {buttonText || 'Submit'}
      </button>
    </form>
  );
}

export default CommonForm;
