import {UserModel, User} from '../model/user';
import {hash, jwtSign} from '../utils/auth';

/**
 * @typedef {Object} SignResult
 * @property {string} loginJwt - 사용자 인증에 사용할 jwt, user: user 도큐먼트
 * @property {User} y - user 도큐먼트
 */

/**
 * @description 회원가입
 * @param loginId 로그인에 사용할 id
 * @param plainPassword 비밀번호
 * @param nickname 닉네임
 * @return {SignResult}
 */
export const signUp = async (loginId: string, plainPassword: string, nickname: string) => {
  const user = await UserModel.create({
    loginId,
    encryptedPassword: hash(plainPassword),
    nickname
  });
  const loginJwt = jwtSign({userId: user._id});

  return {loginJwt, user};
};

/**
 * @description 아이디와 비밀번호를 받아 로그인을 함. 성공할 경우 사용자 인증에 사용할 jwt를 리턴
 * @param loginId 로그인에 사용할 id
 * @param plainPassword 로그인에 사용한 plain password
 * @returns false 로그인에 실패했을 경우
 * @returns {SignResult} 로그인 성공시
 */
export const signIn = async (loginId: string, plainPassword: string) => {
  const user = await UserModel.findOne({loginId});
  if (!user) {
    return false;
  }
  if (user.encryptedPassword !== hash(plainPassword)) {
    return false;
  }

  const loginJwt = jwtSign({userId: user._id});

  return {loginJwt, user};
};

/**
 * @description 아이디가 이미 존재하는지 확인
 * @param loginId 확인할 loginId
 * @returns true 존재할 경우
 * @returns false 존재하지 않을 경우
 */
export const checkDuplicateLoginId = async (loginId: string) => {
  const user = await UserModel.findOne({loginId});
  if (user) {
    return true;
  }
  return false;
};
