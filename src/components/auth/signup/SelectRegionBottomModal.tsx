import { useEffect, useState } from "react";

import { PREFERRED_REGION_TEXT } from "@/constants/texts/common/preferredRegion";
import type { SelectRegionProps } from "@/types/profileTypes";
import type { AreaOption } from "@/types/regionCode";

import { BottomModalLayout } from "@/components/common/modal/bottom-modal/BottomModalLayout";
import {
  BottomModalHeader,
  BottomActionHeader,
} from "@/components/common/modal/bottom-modal/BottomModalHeader";
import { BottomModalListButton } from "@/components/common/modal/bottom-modal/BottomModalListButton";

import { useRegionCodesQuery } from "@/hooks/queries/useRegionCodesQuery";

const REGION_MODAL = PREFERRED_REGION_TEXT.MODAL;

/**
 * 선호 지역 선택 바텀시트 (시/도 → 시·군·구 2단계)
 *
 * 선호 지역 자체는 선택 항목이지만(안 고르고 넘어가도 된다), **고르기 시작했으면
 * 시·군·구까지 골라야 한다.** 서버가 areaCd·sigunguCd 를 쌍으로만 처리하기 때문이다:
 * - 저장   : 한쪽만 보내면 200 을 주면서 조용히 버린다(`MemberRequestDTO` 실측)
 * - 핫플레이스: 데이터가 시·군·구 단위라 시/도만으론 지역을 특정할 수 없다
 * → 시/도만 고르게 두면 사용자는 골랐다고 믿는데 아무 일도 안 일어난다.
 *   고를 수 없게 막는 편이 정직하다.
 *
 * 서버가 areaCd 단독을 지원하게 되면 2단계 첫 항목으로 "○○ 전체"를 되살린다
 * (`PREFERRED_REGION_TEXT.MODAL.AREA_ONLY` 가 그때를 위해 남아 있다).
 *
 * 두 단계를 한 시트 안에서 전환한다 — 시트를 두 번 여닫게 하면 "시·도를 잘못 골랐다"를
 * 되돌리는 경로가 사라진다. 되돌리기는 2단계 헤더의 "지역 다시 선택"이 담당한다.
 */
export const SelectRegionBottomModal = ({
  isRegionModalOpen,
  handleCloseRegionModal,
  region,
  setRegion,
}: SelectRegionProps) => {
  // 선호 지역은 선택 항목이라, 시트를 열어보지도 않은 사용자에게
  // 프로필 화면 진입만으로 252건을 받아올 이유가 없다.
  const { areas, isLoading, isError } = useRegionCodesQuery(isRegionModalOpen);

  /** 1단계에서 고른 시/도. `undefined` 면 아직 1단계다 */
  const [selectedArea, setSelectedArea] = useState<AreaOption | undefined>(
    undefined
  );

  // 닫았다 다시 열면 항상 1단계에서 시작한다.
  // `BottomModalLayout` 은 닫힐 때 언마운트되지만 이 컴포넌트는 부모(ProfileLayout)에
  // 상주하므로, 명시적으로 되돌리지 않으면 지난번 2단계 화면이 그대로 남는다.
  useEffect(() => {
    if (!isRegionModalOpen) setSelectedArea(undefined);
  }, [isRegionModalOpen]);

  /** 시·군·구까지 선택 */
  const handleSelectSigungu = (
    area: AreaOption,
    sigunguCd: string,
    sigunguNm: string
  ) => {
    setRegion({
      areaCd: area.areaCd,
      areaNm: area.areaNm,
      sigunguCd,
      sigunguNm,
    });
    handleCloseRegionModal();
  };

  /** 이미 고른 지역 비우기 */
  const handleClearRegion = () => {
    setRegion(undefined);
    handleCloseRegionModal();
  };

  const renderStatus = (message: string) => (
    <p className="typo-body text-gray-50 whitespace-pre-line px-6 py-10 text-center">
      {message}
    </p>
  );

  const renderList = () => {
    if (isLoading) return renderStatus(REGION_MODAL.LOADING);
    if (isError) return renderStatus(REGION_MODAL.ERROR);

    // 2단계 — 시·군·구
    if (selectedArea) {
      return (
        <>
          {selectedArea.sigungus.map(({ sigunguCd, sigunguNm }) => (
            <BottomModalListButton
              key={sigunguCd}
              label={sigunguNm}
              isChecked={region?.sigunguCd === sigunguCd}
              onClickChecked={() =>
                handleSelectSigungu(selectedArea, sigunguCd, sigunguNm)
              }
            />
          ))}
        </>
      );
    }

    // 1단계 — 시/도
    return (
      <>
        {region && (
          <BottomModalListButton
            label={REGION_MODAL.NONE}
            isChecked={false}
            onClickChecked={handleClearRegion}
          />
        )}
        {areas.map((area) => (
          <BottomModalListButton
            key={area.areaCd}
            label={area.areaNm}
            isChecked={region?.areaCd === area.areaCd}
            onClickChecked={() => setSelectedArea(area)}
          />
        ))}
      </>
    );
  };

  return (
    <BottomModalLayout
      isOpen={isRegionModalOpen}
      onClose={handleCloseRegionModal}
    >
      {selectedArea ? (
        <BottomActionHeader
          title={REGION_MODAL.SIGUNGU_TITLE}
          actionLabel={REGION_MODAL.CHANGE_AREA}
          onClickAction={() => setSelectedArea(undefined)}
        />
      ) : (
        <BottomModalHeader variant="title" title={REGION_MODAL.AREA_TITLE} />
      )}

      {/* 경기도 44개·서울 25개라 목록이 화면을 넘긴다.
          시트는 detent="content-height" 라 여기서 높이를 제한하지 않으면 시트가 화면을 덮는다. */}
      <div className="max-h-[50vh] overflow-y-auto">{renderList()}</div>
    </BottomModalLayout>
  );
};
