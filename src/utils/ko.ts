import { disassembleToGroups, getChoseong } from "es-hangul";

/**
 * 한글 검색 안정성을 위한 문자열 정규화 유틸
 * - NFC 정규화: 같은 글자의 다른 유니코드 표현을 통일
 * - 연속 공백을 한 칸으로 축소
 * - 앞뒤 공백 제거
 */
export const normalizeKo = (s?: string): string => {
  // s가 undefined/null이어도 안전하게 처리
  const safe = s ?? "";
  return safe.normalize("NFC").replace(/\s+/g, " ").trim();
};

/**
 * 검색어를 토큰 배열로 변환합니다.
 * - toLowerCase: 영문 혼용 대비(한글엔 영향 거의 없음)
 * - 공백 기준 split 후 빈 토큰 제거
 */

export function tokenizeQuery(input?: string): string[] {
  const kw = normalizeKo(input).toLowerCase();
  if (!kw) return [];
  return kw.split(/\s+/).filter(Boolean);
}

const RE_ONLY_CHO = /^[ㄱ-ㅎ]+$/; // 초성만
const RE_HAS_SYLL = /[가-힣]/; // 완성음절이 하나라도 포함되어 있는가
const RE_HAS_CHO = /[ㄱ-ㅎ]/; // 초성 문자가 하나라도 포함되어 있는가

// 한 글자가 초성인지
const isChoChar = (ch: string) => /[ㄱ-ㅎ]/.test(ch);

/**
 * 검색어(자모 배열)가 검색 대상(자모 배열)의 startIdx부터
 * 글자 단위로 '연속'해서 맞는지 검사합니다.
 *
 * 규칙
 * - 입력 글자가 '초성만'이면 → 대상 글자의 '초성'이 같아야 함
 * - 입력 글자가 '완성/혼합'이면 → 대상 글자의 자모가 입력 자모로 '시작'해야 함
 *
 * 매개변수
 * - targetGroups: 검색 대상의 글자→자모 배열  예) '서울' → [ ['ㅅ','ㅓ'], ['ㅇ','ㅜ','ㄹ'] ]
 * - startIdx:     검색 대상에서 비교를 시작할 글자 위치(0부터)
 * - inputGroups:  검색어의 글자→자모 배열  예) '서ㅇ' → [ ['ㅅ','ㅓ'], ['ㅇ'] ]
 */

export const groupsMatchFrom = (
  targetGroups: string[][], // 검색 대상
  startIdx: number, // 시작 글자 위치
  inputGroups: string[][] // 검색어
): boolean => {
  // 검색어의 각 글자를 순서대로 검사
  for (let i = 0; i < inputGroups.length; i++) {
    const q = inputGroups[i]; // 검색어의 i번째 ‘음절’ 자모 배열
    const t = targetGroups[startIdx + i]; // 대상의 (startIdx+i)번째 ‘음절’ 자모 배열

    // 검색 대상 길이가 부족하면 실패
    if (!t) return false; // 대상에 해당 인덱스 음절이 없으면 실패

    // 검색어가 초성으로만 이루어져 있는가?
    const qIsOnlyCho = q.length > 0 && q.every(isChoChar);

    if (qIsOnlyCho) {
      // 규칙 A: 초성일 경우 → 대상 음절의 ‘초성’과 일치해야 함
      if (t.length === 0 || t[0] !== q[0]) return false;
    } else {
      // 규칙 B: 완성/혼합일 경우 → 대상 음절 자모가 q 자모들로 ‘시작’해야 함
      for (let j = 0; j < q.length; j++) {
        if (t[j] !== q[j]) return false;
      }
    }
  }
  return true; // 모든 음절 비교를 통과하면 연속 매칭 성공
};

/**
 * 혼합 토큰을 같은 "단어" 안에서만 검사
 * - 단어 경계를 넘는 매칭은 허용하지 않음
 */
export const mixedTokenIncludesWord = (
  token: string,
  target: string
): boolean => {
  const qGroups = disassembleToGroups(token);
  const words = target.split(/\s+/).filter(Boolean);

  for (const word of words) {
    const tGroups = disassembleToGroups(word);
    for (let i = 0; i + qGroups.length <= tGroups.length; i++) {
      if (groupsMatchFrom(tGroups, i, qGroups)) return true;
    }
  }
  return false;
};

export const tokenMatchesTarget = (token: string, target: string): boolean => {
  if (!token) return true;

  const onlyCho = RE_ONLY_CHO.test(token);
  const hasSyll = RE_HAS_SYLL.test(token);
  const hasCho = RE_HAS_CHO.test(token);
  const isMixed = hasSyll && hasCho;

  if (onlyCho) {
    // 초성만: 각 단어의 초성 시퀀스에서 연속 포함이면 OK
    const words = target.split(/\s+/).filter(Boolean);
    for (const w of words) {
      const choSeq = getChoseong(w);
      if (choSeq.startsWith(token)) return true;
    }
    return false;
  }

  if (isMixed) {
    // 혼합: 같은 단어 내부에서만 음절-연속 매칭
    return mixedTokenIncludesWord(token, target);
  }

  // 완성만(또는 영문/숫자): 일반 포함
  return target.includes(token);
};
