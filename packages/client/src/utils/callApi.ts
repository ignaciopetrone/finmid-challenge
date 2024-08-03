export class ApiError extends Error {
  public statusCode?: number;
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiCallOptions = {
  method: Method;
  endpoint: string;
  payload?: any;
};

const API_HOST =
  process.env.NODE_ENV === 'production'
    ? 'http://localhost:3000'
    : 'http://localhost:3000';

const callApi = async <T = any>({
  method,
  endpoint,
  payload,
}: ApiCallOptions): Promise<T> => {
  const headers: Record<string, string> = {};

  const url = `${API_HOST}/api${endpoint}`;
  let fetchOptions: RequestInit = { headers, method, credentials: 'include' };

  if (payload) {
    headers['Content-Type'] = 'application/json';
    fetchOptions = { ...fetchOptions, body: JSON.stringify(payload) };
  }

  const response = await fetch(url, fetchOptions);

  if (response.status >= 400) {
    const error = new ApiError();
    error.message = response.statusText;
    error.statusCode = response.status;
    try {
      const { message } = await response.json();
      if (message) {
        error.message = message;
      }
    } catch {}
    throw error;
  } else {
    return response.json();
  }
};

export default callApi;
