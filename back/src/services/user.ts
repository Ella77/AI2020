import {UserModel, User} from '../model/user';
import {hash, jwtSign} from '../utils/auth';

/**
 * @description 회원가입
 * @param loginId 로그인에 사용할 id
 * @param plainPassword 비밀번호
 * @param nickname 닉네임
 */
export const signUp = async (loginId: string, plainPassword: string, nickname: string) => {
  await UserModel.create({
    loginId,
    encryptedPassword: hash(plainPassword),
    nickname
  });
  return true;
};

/**
 * @description 아이디와 비밀번호를 받아 로그인을 함. 성공할 경우 사용자 인증에 사용할 jwt를 리턴
 * @param loginId 로그인에 사용할 id
 * @param plainPassword 로그인에 사용한 plain password
 * @returns false 로그인에 실패했을 경우
 * @returns loginJwt string, 사용자 인증에 사용할 jwt
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

  return loginJwt;
};
