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
  onCardClick?: (id: number) => void;
  onDeleteClick?: (id: number) => void;
  onTimeClick?: (id: number) => void;
  onLocationClick?: (id: number) => void;
}

/** 드래그 가능한 개별 카드 래퍼 */
const SortableCard = ({
  data,
  onCardClick,
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
        onCardClick={onCardClick}
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
  onCardClick?: (id: number) => void;
  onDeleteClick?: (id: number) => void;
  onTimeClick?: (id: number) => void;
  onLocationClick?: (id: number) => void;
}

/**
 * 플랜 카드 목록 컴포넌트 (제어 컴포넌트 패턴)
 *
 * 🎯 제어 컴포넌트란?
 * - 부모가 상태(items)를 소유하고, 자식은 그것을 "읽기만" 함
 * - 변경이 필요하면 부모에게 알려서(onOrderChange) 부모가 상태를 업데이트
 * - 부모 → 자식으로 데이터가 흐르고, 자식 → 부모로 이벤트가 흐름 (단방향 데이터 흐름)
 *
 * 왜 이 패턴을 사용하나요?
 * - 이전 코드: items를 내부 useState로 복사 → 부모가 items를 바꿔도 내부 상태는 안 바뀜 (데이터 불일치)
 * - 지금 코드: items를 직접 사용 → 부모가 items를 바꾸면 바로 반영됨 (항상 동기화)
 */
const PlanCardList = ({
  items,
  onOrderChange,
  onCardClick,
  onDeleteClick,
  onTimeClick,
  onLocationClick,
}: PlanCardListProps) => {
  // 🎯 useState 제거됨!
  // 이전: const [items, setItems] = useState(initialItems);
  // 지금: props로 받은 items를 직접 사용

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

  // 🎯 드래그 완료 핸들러 (제어 컴포넌트 패턴)
  // - 내부 상태 변경 X → 부모에게 새 순서를 알려주기만 함
  // - 부모가 items를 업데이트하면 → 이 컴포넌트가 리렌더링되어 새 순서 반영
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // items에서 드래그한 아이템과 드롭한 위치의 인덱스 찾기
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      // 순서 변경된 새 배열 생성
      const newItems = arrayMove(items, oldIndex, newIndex);

      // 부모에게 새 순서 알림 → 부모가 상태 업데이트 → 이 컴포넌트 리렌더링
      onOrderChange?.(newItems);
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
              onCardClick={onCardClick}
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
