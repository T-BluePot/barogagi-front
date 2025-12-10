import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { mockPlans } from "@/mock/plans";

import PlanDetailCard from "./PlanDetailCard";
// 실제 프로젝트에서는 아래 타입을 가져와도 됨
// import type { PlanDetailCardProps } from "@/types/main/plan/planListTypes";

const meta = {
  title: "Components/Main/Plan/Route/PlanDetailCard",
  component: PlanDetailCard,
  tags: ["autodocs"],
  args: {
    plan: mockPlans[0].plan,
    place: mockPlans[0].place,
    tags: mockPlans[0].tags,
    src: mockPlans[0].src,
  },
} satisfies Meta<typeof PlanDetailCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Create: Story = {
  args: {
    mode: "create",
    isOpen: false,
    onToggleOpen: () => {},
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <PlanDetailCard
          {...args}
          isOpen={isOpen}
          onToggleOpen={() => setIsOpen((prev) => !prev)}
        />
      </div>
    );
  },
};

export const Detial: Story = {
  args: {
    mode: "detail",
    isOpen: false,
    onToggleOpen: () => {},
    onOpenCardMenu: (info) => {
      console.log("Open card menu for planNum:", info.planNum);
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <PlanDetailCard
          {...args}
          isOpen={isOpen}
          onToggleOpen={() => setIsOpen((prev) => !prev)}
        />
      </div>
    );
  },
};
