/**
 * 회원(Member) 관련 타입 변환 함수
 */

import type { MemberResponseDTO } from "@/api/types";
import type { UserData } from "@/types/profileTypes";

/**
 * 서버가 "값 없음"으로 쓰는 표현을 `undefined` 로 통일한다.
 *
 * `GET /members` 는 미설정 필드를 `null` 이 아니라 **빈 문자열**로 준다
 * (`gender` 만 `null`). 이걸 그대로 화면에 넘기면 `""` 이 falsy 라서 우연히 동작하다가,
 * `birth === ""` 같은 비교를 하는 순간 조용히 어긋난다. 경계에서 한 번에 끊는다.
 */
const emptyToUndefined = (value: string | null | undefined): string | undefined =>
  value ? value : undefined;

/**
 * 회원 조회 응답 DTO → 화면용 회원 정보
 *
 * 🚫 `password` 는 옮기지 않는다. 서버가 응답에 포함하지만(값은 빈 문자열)
 *    화면이 알 이유가 없고, 타입에 남겨두면 언젠가 쓰게 된다.
 */
export const toUserData = (dto: MemberResponseDTO): UserData => ({
  userId: dto.userId,
  nickName: dto.nickName,
  gender: emptyToUndefined(dto.gender),
  birth: emptyToUndefined(dto.birth),
  areaCd: emptyToUndefined(dto.areaCd),
  sigunguCd: emptyToUndefined(dto.sigunguCd),
});
