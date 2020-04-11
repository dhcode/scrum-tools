import { HttpException } from '@nestjs/common';

export class EstimationError extends HttpException {
  constructor(status: number, code: string, description: string) {
    super(
      {
        code: code,
        message: description,
      },
      status,
    );
  }
}
