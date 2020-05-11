import { Validator as BaseValidator, Errors } from 'moleculer';
import FastestValidator from 'fastest-validator';

export class CustomValidator extends BaseValidator {
  private _validator: FastestValidator;

  constructor() {
    super();
    this._validator = new FastestValidator();
  }

  compile(schema: any) {
    return this._validator.compile({
      ...schema,
      $$strict: true,
    });
  }

  validate(params: any, schema: any) {
    const res = this._validator.validate(params, schema);

    if (res !== true)
      throw new Errors.ValidationError(
        'Parameters validation error!',
        null,
        res,
      );

    return true;
  }
}
