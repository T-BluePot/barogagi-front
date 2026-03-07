import { useState, useEffect } from "react";
import PlanCardList from "@/components/main/plan/PlanCardList";
import PlanAddButton from "@/components/main/plan/PlanAddButton";
import type { PlanData } from "@/components/main/plan/PlanCard";

interface PlanSettingFormProps {
  initialItems?: PlanData[];
  onAddPlan?: () => void;
  onOrderChange?: (items: PlanData[]) => void;
  onCardClick?: (id: number) => void;
  onDeleteClick?: (id: number) => void;
  onTimeClick?: (id: number) => void;
  onLocationClick?: (id: number) => void;
}

export const PlanSettingForm = ({
  initialItems = [],
  onAddPlan,
  onOrderChange,
  onCardClick,
  onDeleteClick,
  onTimeClick,
  onLocationClick,
}: PlanSettingFormProps) => {
  const [items, setItems] = useState<PlanData[]>(initialItems);

  // initialItems가 변경되면 items도 업데이트 (삭제 후 리렌더링 대응)
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleOrderChange = (newItems: PlanData[]) => {
    setItems(newItems);
    onOrderChange?.(newItems);
  };

  return (
    <div className="flex flex-col gap-3">
      <PlanCardList
        items={items}
        onOrderChange={handleOrderChange}
        onCardClick={onCardClick}
        onDeleteClick={onDeleteClick}
        onTimeClick={onTimeClick}
        onLocationClick={onLocationClick}
      />
      <PlanAddButton onClick={onAddPlan ?? (() => {})} />
    </div>
  );
};
