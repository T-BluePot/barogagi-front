import type { Region } from "@/types/main/plan/region";
import { normalizeKo, tokenMatchesTarget } from "./ko";

/**
 * 지역 리스트 필터링(재사용 가능)
 * - keywordRaw: 사용자가 입력한 검색어 원문 (정규화/소문자화는 내부에서 처리)
 * - 반환: Region[]
 */

export function filterRegionsKorean(
  regions: Region[],
  keywordRaw?: string
): Region[] {
  // 1) 검색어 전처리(정규화 + 소문자화)
  const keyword = normalizeKo(keywordRaw).toLowerCase();
  if (!keyword) return []; // 입력이 비어있으면 결과도 비움(UX: 패널 닫기)

  // 2) 공백 기준 토큰화(AND 매칭)
  const tokens = keyword.split(/\s+/).filter(Boolean);

  // 3) 각 Region의 전체 이름을 만들고 동일 전처리 후 토큰들을 적용
  return regions.filter((region) => {
    // 3-1) Region 풀네임 만들기
    const fullName = [
      region.REGION_LEVEL_1,
      region.REGION_LEVEL_2,
      region.REGION_LEVEL_3,
      region.REGION_LEVEL_4,
    ]
      .filter(Boolean) // 빈 항목 제거
      .join(" "); // 공백으로 연결

    // 3-2) 대상 문자열 전처리(정규화 + 소문자화)
    const target = normalizeKo(fullName).toLowerCase();

    // 3-3) 모든 토큰이 매칭되어야 통과(AND)
    return tokens.every((tok) => tokenMatchesTarget(tok, target));
  });
}
