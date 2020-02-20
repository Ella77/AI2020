import {wrapper} from '../utils/wrapper';
import validate from 'validate.js';
import * as userServices from '../services/user';

export const signUp = wrapper(async (req, res) => {
  const input = {
    loginId: req.body.loginId,
    plainPassword: req.body.plainPassword,
    nickname: req.body.nickname
  };
  const invalid = validate(input, {
    loginId: {
      presence: true,
      type: 'string'
    },
    plainPassword: {
      presence: true,
      type: 'string'
    },
  });
  if (invalid) {
    return res.status(400).json({msg: invalid});
  }
  const exists = await userServices.checkDuplicateLoginId(input.loginId);
  if (exists) {
    return res.status(409).json({msg: 'exists loginId'});
  }

  const result = await userServices.signUp(input.loginId, input.plainPassword, input.nickname || input.loginId);
  res.cookie('X-Login-Token', result.loginJwt);
  return res.status(200).json({
    'X-Login-Token': result.loginJwt,
    user: result.user
  });
});

export const signIn = wrapper(async (req, res) => {
  const input = {
    loginId: req.body.loginId,
    plainPassword: req.body.plainPassword,
  };
  const invalid = validate(input, {
    loginId: {
      presence: true,
      type: 'string'
    },
    plainPassword: {
      presence: true,
      type: 'string'
    },
  });
  if (invalid) {
    return res.status(400).json({msg: invalid});
  }

  const result = await userServices.signIn(input.loginId, input.plainPassword);
  if (!result) {
    return res.status(403).json({msg: 'Login failed'});
  }
  res.cookie('X-Login-Token', result.loginJwt);
  return res.status(200).json({
    'X-Login-Token': result.loginJwt,
    user: result.user
  });
});
