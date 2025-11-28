import ScheduleIcon from "@mui/icons-material/Schedule";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import type { SxProps, Theme } from "@mui/material/styles";
import type {
  IconType,
  IconKey,
  ColorState,
} from "@/types/main/plan/bottom-modal/itemsTypes";

// 공통 아이콘 스타일 (색상 제외)
// - 모든 아이콘에 공통으로 적용할 스타일을 정의
const BASE_ICON_SX: SxProps<Theme> = {
  fontSize: 20,
};

// ColorState에 따라 아이콘 색상을 반환하는 함수
// - 상태가 늘어나면 이 함수만 확장하면 됨
const getIconColor = (state: ColorState): string => {
  if (state === "placeholder") {
    // placeholder 상태일 때 사용할 색상
    return "#888888";
  }

  // default 상태일 때 사용할 색상
  return "#454545";
};

// 아이콘 키값에 대응하는 MUI 아이콘 컴포넌트를 매핑
// - ReactElement가 아니라 "컴포넌트" 자체를 저장하는 것이 포인트
const iconMap: Record<IconKey, typeof ScheduleIcon> = {
  Time: ScheduleIcon,
  Place: LocationPinIcon,
  Note: EditOutlinedIcon,
  Tag: StarBorderIcon,
};

type IconRendererProps = {
  icon: IconType;
};

// IconType에 따라 적절한 아이콘을 렌더링하는 컴포넌트
export const IconRenderer = ({ icon }: IconRendererProps) => {
  if (icon.type === "key") {
    // 아이콘 키값에 해당하는 컴포넌트 찾기
    const IconComp = iconMap[icon.name];

    // ColorState 에 따라 sx.color를 분기해 아이콘 렌더링
    return (
      <IconComp
        sx={{
          ...BASE_ICON_SX,
          color: getIconColor(icon.state),
        }}
      />
    );
  }

  // type: "node" 인 경우에는 넘어온 JSX를 그대로 렌더링
  return icon.node;
};
