import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import PopMenu from "./PopMenu";
import type { PopListProps } from "./Poplist";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const meta: Meta<typeof PopMenu> = {
  title: "Components/Common/Menu/PopMenu",
  component: PopMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    placement: "left-start",
  },
};

export default meta;
type Story = StoryObj<typeof PopMenu>;

export const Default: Story = {
  args: {
    listItems: [
      {
        status: "normal",
        label: "수정하기",
        children: <ModeEditIcon className="!text-[16px]" />,
        onClickItem: () => console.log("수정 클릭"),
      },
      {
        status: "delete",
        label: "삭제하기",
        children: (
          <DeleteOutlineIcon className="!text-[16px] !text-alert-red" />
        ),
        onClickItem: () => console.log("삭제 클릭"),
      },
    ] as PopListProps[],
  },
  render: (args) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(e.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const open = Boolean(anchorEl);
    return (
      <div>
        <button
          onClick={handleOpen}
          className="rounded-full bg-transparent w-[24px] h-[24px] hover:bg-gray-10 active:bg-gray-10 transition-colors duration-300 ease-in-out"
        >
          <MoreVertIcon className="text-gray-40 !text-[20px]" />
        </button>
        <PopMenu
          {...args}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        />
      </div>
    );
  },
};
