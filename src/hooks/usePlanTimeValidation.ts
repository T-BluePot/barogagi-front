import { useCallback } from "react";
import type { PlanData } from "@/components/main/plan/PlanCard";

/**
 * =============================================
 * usePlanTimeValidation - 일정 시간 유효성 검증 훅
 * =============================================
 *
 * [검증 기준]
 *
 * 1. 시작·종료 시간 필수 여부
 *    - startTime, endTime 이 모두 존재해야 유효한 일정으로 판단
 *
 * 2. 시작 시간 < 종료 시간
 *    - 개별 일정의 시작 시간이 종료 시간보다 같거나 늦을 수 없음
 *
 * 3. 순서 기반 시간 정합성 (앞뒤 일정 간 시간 순서)
 *    - 뒷순서 일정의 시작 시간이 앞순서 일정의 종료 시간보다 앞설 수 없음
 *    - 예: 1번 일정 종료 15:00 → 2번 일정 시작 14:00 ✗
 *
 * 4. 시간 중복(겹침) 방지
 *    - 서로 다른 일정의 시간 범위가 겹칠 수 없음
 *    - 예: 1번 13:00~15:00, 2번 14:00~16:00 ✗
 *
 * 5. 최소 일정 시간 보장
 *    - 시작 시간과 종료 시간이 동일할 수 없음 (최소 1분 이상 차이)
 */

export interface TimeValidationResult {
  isValid: boolean;
  errorTitle?: string;
  errorContent?: string;
}

/**
 * "HH:mm" 문자열을 분(minute) 단위 숫자로 변환
 * @example "14:30" → 870
 */
export const hhmmToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// 분 → HH:mm 변환
export const minutesToHHmm = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

/**
 * 일정 시간 유효성 검증 훅
 * @param items - 현재 일정 목록 (순서대로)
 */
export const usePlanTimeValidation = (items: PlanData[]) => {
  /**
   * 개별 일정의 시작/종료 시간 유효성 검증
   * - 기준 2: 시작 시간 < 종료 시간
   * - 기준 5: 최소 일정 시간 보장 (시작 ≠ 종료)
   */
  const validateTimeRange = useCallback(
    (startTime: string, endTime: string): TimeValidationResult => {
      const startMin = hhmmToMinutes(startTime);
      const endMin = hhmmToMinutes(endTime);

      if (startMin === endMin) {
        return {
          isValid: false,
          errorTitle: "시간을 확인해주세요",
          errorContent: "시작 시간과 종료 시간이 동일합니다.",
        };
      }

      if (startMin > endMin) {
        return {
          isValid: false,
          errorTitle: "시간을 확인해주세요",
          errorContent: "시작 시간이 종료 시간보다 늦을 수 없습니다.",
        };
      }

      return { isValid: true };
    },
    []
  );

  /**
   * 순서 기반 시간 정합성 검증
   * - 기준 3: 뒷순서 일정의 시작 시간 ≥ 앞순서 일정의 종료 시간
   * - 기준 4: 일정 간 시간 중복(겹침) 방지
   *
   * @param startTime - 검증할 일정의 시작 시간 (HH:mm)
   * @param endTime   - 검증할 일정의 종료 시간 (HH:mm)
   * @param insertIndex - 해당 일정이 놓일 순서 인덱스 (새 일정은 items.length)
   * @param excludeId   - 수정 모드일 때 자기 자신을 제외할 id
   */
  const validateOrder = useCallback(
    (
      startTime: string,
      endTime: string,
      insertIndex: number,
      excludeId?: string | number
    ): TimeValidationResult => {
      const others =
        excludeId !== undefined
          ? items.filter((_, i) => i !== insertIndex)
          : [...items];

      const startMin = hhmmToMinutes(startTime);
      const endMin = hhmmToMinutes(endTime);

      // insertIndex는 others 기준 인덱스이므로 먼저 슬라이스 후 시간 없는 항목 제외
      const before = others
        .slice(0, insertIndex)
        .filter((item) => item.startTime && item.endTime);
      for (const prev of before) {
        const prevEndMin = hhmmToMinutes(prev.endTime!);
        if (startMin < prevEndMin) {
          return {
            isValid: false,
            errorTitle: "시간 순서를 확인해주세요",
            errorContent: `"${prev.title}" 일정(~${prev.endTime})보다 앞선 시간입니다.`,
          };
        }
      }

      // 뒷순서 일정과 비교: insertIndex 뒤에 있는 일정들
      const after = others
        .slice(insertIndex)
        .filter((item) => item.startTime && item.endTime);
      for (const next of after) {
        const nextStartMin = hhmmToMinutes(next.startTime!);
        if (endMin > nextStartMin) {
          return {
            isValid: false,
            errorTitle: "시간 순서를 확인해주세요",
            errorContent: `"${next.title}" 일정(${next.startTime}~)과 시간이 겹칩니다.`,
          };
        }
      }

      return { isValid: true };
    },
    [items]
  );

  /**
   * 전체 검증 (개별 + 순서)
   *
   * @param startTime   - 시작 시간 (HH:mm)
   * @param endTime     - 종료 시간 (HH:mm)
   * @param insertIndex - 일정이 놓일 순서 인덱스
   * @param excludeId   - 수정 모드 시 자기 자신 제외 id
   */
  const validatePlanTime = useCallback(
    (
      startTime: string,
      endTime: string,
      insertIndex: number,
      excludeId?: string | number
    ): TimeValidationResult => {
      // 기준 2, 5: 개별 시간 유효성
      const rangeResult = validateTimeRange(startTime, endTime);
      if (!rangeResult.isValid) return rangeResult;

      // 기준 3, 4: 순서 기반 정합성 + 중복 방지
      const orderResult = validateOrder(
        startTime,
        endTime,
        insertIndex,
        excludeId
      );
      if (!orderResult.isValid) return orderResult;

      return { isValid: true };
    },
    [validateTimeRange, validateOrder]
  );

  return { validatePlanTime, validateTimeRange, validateOrder };
};
