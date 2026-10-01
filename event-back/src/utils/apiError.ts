interface ApiErrors {
  badRequest: (message: string) => Response;
  unauthorized: (message: string) => Response;
  forbidden: (message: string) => Response;
  notFound: (message: string) => Response;
  conflict: (message: string) => Response;
}

interface Response {
  message: string;
  status: number;
}

export const apiError: ApiErrors = {
  badRequest: (message) => {
    return {
      message,
      status: 400,
    };
  },

  unauthorized: (message) => {
    return {
      message,
      status: 401,
    };
  },

  forbidden: (message) => {
    return {
      message,
      status: 403,
    };
  },

  notFound: (message) => {
    return {
      message,
      status: 404,
    };
  },

  conflict: (message) => {
    return {
      message,
      status: 409,
    };
  },
};
