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

export class GraphQLUiError extends Error {
  code: string;

  constructor(err: any) {
    const info = extractGraphQLError(err);
    super(info.message);
    this.code = info.code;
  }
}
