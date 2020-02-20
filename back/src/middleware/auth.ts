import {wrapper} from '../utils/wrapper';
import {jwtVerify} from '../utils/auth';
import {UserModel} from '../model/user';

/**
 * @description 쿠키의 혹은 헤더의 X-Login-Token 필드에 접근해 유효한 token인지 확인하는 미들웨어
 * 유효하지 않을 경우 403 forbidden을 보내고 유효할 경우 req.user에 해당 user를 저장해 다음 라우터에 넘겨줌
 */
export const verifyLogin = wrapper(async (req, res, next) => {
  const token = req.cookies['X-Login-Token'] || req.get('X-Login-Token');
  if (!token) {
    return res.status(403).send(null);
  }
  let decoded: any;
  try {
    decoded = jwtVerify(token);
  } catch (err) {
    return res.status(403).send(null);
  }
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    return res.status(403).send(null);
  }
  req.user = user;
  next();
});