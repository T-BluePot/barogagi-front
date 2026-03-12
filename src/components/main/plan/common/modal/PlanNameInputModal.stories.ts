import type { StoryObj, Meta } from "@storybook/react-vite";
import { fn } from "storybook/test";
import PlanNameInputModal from "./PlanNameInputModal";

const meta: Meta<typeof PlanNameInputModal> = {
  title: "Components/Main/Plan/Modal/PlanNameInputModal",
  component: PlanNameInputModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    isOpen: true,
    onConfirm: fn(),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
