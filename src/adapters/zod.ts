import type {Resolver} from '../resolver';
import type {Coerce, CreateValidate} from '.';
import type {input, output, ZodSchema} from 'zod';

import {isJSONSchema, isTypeBoxSchema} from '../utils';
import {ValidationIssue} from '../validation';

export interface ZodResolver extends Resolver {
  base: ZodSchema<this['type']>;
  input: this['schema'] extends ZodSchema ? input<this['schema']> : never;
  output: this['schema'] extends ZodSchema ? output<this['schema']> : never;
}

const coerce: Coerce<'zod'> = fn => schema =>
  '_def' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? fn(schema)
    : undefined;

export const createValidate: CreateValidate = /*@__PURE__*/ coerce(
  async schema => async (data: unknown) => {
    const result = await schema.safeParseAsync(data);
    if (result.success) {
      return {data: result.data};
    }
    return {
      issues: result.error.issues.map(
        ({message, path}) => new ValidationIssue(message, path),
      ),
    };
  },
);
