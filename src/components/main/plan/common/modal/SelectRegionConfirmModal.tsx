import { useState, useEffect } from "react";
import CommonConfirmModalLayout from "@/components/layout/CommonConfirmModalLayout";
import {
  SelectRegionConfirmModalContent,
  type RegionOption,
} from "./content/SelectRegionConfirmModalContent";

interface SelectRegionConfirmModalProps {
  isOpen: boolean;
  regions: RegionOption[];
  initialSelectedId?: string;
  onConfirm: (region: RegionOption | null) => void;
  onCancel: () => void;
}

export const SelectRegionConfirmModal = ({
  isOpen,
  regions,
  initialSelectedId,
  onConfirm,
  onCancel,
}: SelectRegionConfirmModalProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionOption | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const initial = regions.find((r) => r.id === initialSelectedId) ?? null;
      setSelectedRegion(initial);
      requestAnimationFrame(() => setShowAnimation(true));
    } else {
      setShowAnimation(false);
    }
  }, [isOpen, regions, initialSelectedId]);

  const handleConfirm = () => {
    onConfirm(selectedRegion);
  };

  if (!shouldRender) return null;

  return (
    <CommonConfirmModalLayout
      isVisible={showAnimation}
      confirmButtonInfo={{ label: "확인", onClick: handleConfirm }}
      cancelButtonInfo={{ label: "취소", onClick: onCancel }}
      onCloseComplete={() => setShouldRender(false)}
    >
      <SelectRegionConfirmModalContent
        regions={regions}
        initialSelectedId={initialSelectedId}
        onChangeRegion={setSelectedRegion}
      />
    </CommonConfirmModalLayout>
  );
};

export type { RegionOption };
export default SelectRegionConfirmModal;
