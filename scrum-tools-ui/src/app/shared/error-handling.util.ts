export function extractGraphQLError(err: any): { code: string; message: string } {
  if (err && err.graphQLErrors && err.graphQLErrors.length) {
    return (
      err.graphQLErrors[0].extensions?.exception?.response || {
        code: 'unknownError',
        message: err.graphQLErrors[0].message,
      }
    );
  } else {
    return {
      code: 'unknownError',
      message: err.toString(),
    };
  }
}

export class CodedError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
  }
}

export class GraphQLUiError extends CodedError {
  constructor(err: any) {
    const info = extractGraphQLError(err);
    super(info.code, info.message);
  }
}
