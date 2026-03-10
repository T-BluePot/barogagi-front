import type { StoryObj, Meta } from "@storybook/react-vite";
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
