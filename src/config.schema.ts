import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  FORTYTWO_CLIENT_ID: Joi.string().required(),
  FORTYTWO_CLIENT_SECRET: Joi.string().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
});
