import {describe, expect, jest, test} from '@jest/globals';
import Joi from 'joi';

import {assert, clearCache, validate} from '..';
import {ValidationIssue} from '../schema';

describe('joi', () => {
  const schema = Joi.string();
  const module = 'joi';

  test('validate', async () => {
    expect(await validate(schema, '123')).toStrictEqual({data: '123'});
    expect(await validate(schema, 123)).toStrictEqual({
      issues: [new ValidationIssue('"value" must be a string')],
    });
    clearCache();
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(validate(schema, '123')).rejects.toThrow();
    jest.unmock(module);
  });

  test('assert', async () => {
    expect(await assert(schema, '123')).toStrictEqual('123');
    await expect(assert(schema, 123)).rejects.toThrow();
    clearCache();
    jest.mock(module, () => {
      throw new Error('Cannot find module');
    });
    await expect(assert(schema, '123')).rejects.toThrow();
    jest.unmock(module);
  });
});
