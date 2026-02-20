import {
  clsx,
  createCheckboxField,
  createSelectField,
  createTextareaField,
  createTextField,
} from '@hanlogy/react-web-ui';

const labelClass = 'text-gray-500';
const helperClass = 'text-gray-500';
const errorClass = 'text-red-600';
const inputClass = ({ isError }: { isError: boolean }) => {
  return clsx('border rounded-xl focus-within:ring-2', {
    'bg-red-100 border-red-300 focus-within:ring-red-200': isError,
    'bg-gray-50 border-gray-200 focus-within:ring-blue-300': !isError,
  });
};

export function createTextFieldWith({
  className,
}: { className?: string } = {}) {
  return createTextField({
    labelClass,
    helperClass,
    errorClass,
    inputClass: ({ isError }) => {
      return clsx(inputClass({ isError }), className);
    },
  });
}

export const TextField = createTextFieldWith();

export const TextareaField = createTextareaField({
  labelClass,
  helperClass,
  errorClass,
  inputClass,
});

export const SelectField = createSelectField({
  labelClass,
  helperClass,
  errorClass,
  inputClass,
});

export const CheckboxField = createCheckboxField({
  labelClass,
  helperClass,
  errorClass,
});
