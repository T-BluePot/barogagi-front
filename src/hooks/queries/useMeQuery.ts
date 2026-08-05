import { useQuery } from "@tanstack/react-query";

// === api ===
import { authKeys } from "@/api/keyFactories";
import { getMe } from "@/api/queries/authQueries";
import { toUserData } from "@/utils/api/memberMapper";

/**
 * 내 회원 정보 조회 훅
 *
 * 홈 헤더·홈·프로필·프로필 수정·공유 시트가 **같은 쿼리 키를 공유**하므로
 * 여러 곳에서 불러도 요청은 한 번이다.
 *
 * `select` 에서 `toUserData` 로 변환해 내보낸다 — 서버가 미설정을 빈 문자열·`null` 로
 * 섞어 주는 걸 화면마다 각자 처리하면 같은 실수가 다섯 번 반복된다.
 *
 * `retry: false` 는 유지한다. 로그인 직후·비로그인 경계에서 401 이 날 수 있는데,
 * 부가 정보라 재시도로 화면을 붙잡을 이유가 없다(`getMe` 는 전역 오류 화면에서도 제외됨).
 */
export const useMeQuery = () => {
  const query = useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
    // `data` 가 비어 올 수 있다고 보고 방어한다. 타입상으로는 항상 채워져 있지만
    // 그 타입은 실측 한 번으로 적은 것이고, 같은 서버가 다른 엔드포인트에서는
    // 성공 응답에 `data: null` 을 준 전례가 있다(`popular` 의 `M201` — useHotPlacesQuery 참고).
    // 비면 `undefined` 가 되는데 소비처 다섯 곳 모두 로딩 중 상태로 이미 대비돼 있다.
    select: (res) => (res?.data ? toUserData(res.data) : undefined),
  });

  return {
    user: query.data,
    /** 첫 응답(성공·실패) 전 상태. 이후 동작을 막아야 할 때 쓴다 */
    isPending: query.isPending,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
