import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

function isValidOption(v: number | null): boolean {
  return (typeof v === 'number' && v % 1 === 0) || v === null;
}

@ValidatorConstraint({ name: 'estimationOption' })
export class IsEstimationOption implements ValidatorConstraintInterface {
  validate(value: any): Promise<boolean> | boolean {
    return Array.isArray(value) && value.every(isValidOption);
  }
}
