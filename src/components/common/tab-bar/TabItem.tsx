import type { TabVariant } from "@/constants/tabs";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

interface TabItemProps {
  variant: TabVariant; // 어떤 탭인지
  isActive: boolean; // 현재 활성 상태
}

export const TabItem = ({
  variant = "home",
  isActive = false,
}: TabItemProps) => {
  const iconClass = {
    fontSize: 36,
    color: isActive ? "var(--color-main)" : "var(--color-gray-white)",
  };

  return (
    <div
      className="flex w-10 h-10 justify-center items-center"
      aria-current={isActive ? "page" : undefined}
    >
      {variant === "home" && <HomeOutlinedIcon sx={iconClass} />}
      {variant === "plan" && <AddOutlinedIcon sx={iconClass} />}
      {variant === "my" && <PersonOutlineOutlinedIcon sx={iconClass} />}
    </div>
  );
};
