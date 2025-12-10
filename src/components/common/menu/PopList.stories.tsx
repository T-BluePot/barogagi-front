import type { Meta, StoryObj } from "@storybook/react-vite";
import { PopList } from "./Poplist";

import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const meta: Meta<typeof PopList> = {
  title: "Components/Common/Menu/PopList",
  component: PopList,
  tags: ["autodocs"],
  args: {
    onClickItem: () => console.log("Clicked item:"),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: "normal",
    label: "수정하기",
    children: <ModeEditIcon className="!text-[16px]" />,
  },
};

export const Delete: Story = {
  args: {
    status: "delete",
    label: "삭제하기",
    children: <DeleteOutlineIcon className="!text-[16px] !text-alert-red" />,
  },
};
