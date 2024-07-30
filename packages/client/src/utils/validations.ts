type InputType = 'email' | 'password';

type ErrorKey = 'isRequired' | 'minLength' | 'maxLength' | 'invalid';

type ValidationOptions = {
  minLength?: number;
  maxLength?: number;
  isRequired?: boolean;
  format?: string;
};

const validationRules: { [key: string]: ValidationOptions } = {
  email: {
    minLength: 6,
    maxLength: 35,
    isRequired: true,
    format: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  },
  password: { isRequired: true },
};

export const isEmpty = (value: any) =>
  value === null || value === undefined || value === '';

export const runValidation = (value: string, name: InputType) => {
  const error: string[] = [];
  const { minLength, maxLength, isRequired, format } = validationRules[name];

  if (!value && isRequired) {
    error.push('isRequired');
  }

  if (minLength && minLength > value.length) {
    error.push('minLength');
  }

  if (maxLength && maxLength < value.length) {
    error.push('maxLength');
  }

  if (format && !new RegExp(format).test(value)) {
    error.push('invalid');
  }

  return error.length ? error[0] : undefined;
};

const errorMessages = {
  isRequired: (label: string) => `${label} is required`,
  minLength: (label: string) => `${label} is too short`,
  maxLength: (label: string) => `${label} is too long`,
  invalid: (label: string) => `${label} is invalid`,
  whitespaces: (label: string) => 'This field does not allow whitespaces',
  unAvailable: (label: string) => `This ${label} is not available`,
};

export const getErrorMessage = (errorKey: ErrorKey, label?: any) =>
  errorMessages[errorKey](label);
