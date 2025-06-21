import { Controller } from "react-hook-form";

function CommonForm({ formControls = [], form, buttonText, handleSubmit }) {
  console.log(form);
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="w-xl h-[300px] grid grid-cols-1 grid-rows-4">
      {formControls.map((controlItem, index) =>
        controlItem.componentType === "input" ? (
          <div>
            <label htmlFor={controlItem.name}>{controlItem.label}</label>
            <Controller
              control={form.control}
              name={controlItem.name}
              render={({ field }) => (
                <input
                  type={controlItem.type}
                  name={controlItem.name}
                  placeholder={controlItem.placeholder}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            ></Controller>
          </div>
        ) : null
      )}
      <button type="submit" className="text-amber-50">{buttonText || "Submit"}</button>
    </form>
  );
}

export default CommonForm;
