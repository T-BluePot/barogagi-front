import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import PlanCard, { type PlanData } from "./PlanCard";

interface SortableCardProps {
  data: PlanData;
  onDeleteClick?: (id: string | number) => void;
  onTimeClick?: (id: string | number) => void;
  onLocationClick?: (id: string | number) => void;
}

/** 드래그 가능한 개별 카드 래퍼 */
const SortableCard = ({
  data,
  onDeleteClick,
  onTimeClick,
  onLocationClick,
}: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: data.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <PlanCard
        data={data}
        onDeleteClick={onDeleteClick}
        onTimeClick={onTimeClick}
        onLocationClick={onLocationClick}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

interface PlanCardListProps {
  items: PlanData[];
  onOrderChange?: (items: PlanData[]) => void;
  onDeleteClick?: (id: string | number) => void;
  onTimeClick?: (id: string | number) => void;
  onLocationClick?: (id: string | number) => void;
}

const PlanCardList = ({
  items: initialItems,
  onOrderChange,
  onDeleteClick,
  onTimeClick,
  onLocationClick,
}: PlanCardListProps) => {
  const [items, setItems] = useState(initialItems);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동해야 드래그 시작 (클릭과 구분)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = currentItems.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(currentItems, oldIndex, newIndex);

        onOrderChange?.(newItems);
        return newItems;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <SortableCard
              key={item.id}
              data={item}
              onDeleteClick={onDeleteClick}
              onTimeClick={onTimeClick}
              onLocationClick={onLocationClick}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default PlanCardList;
