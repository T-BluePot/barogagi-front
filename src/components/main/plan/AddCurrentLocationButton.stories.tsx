import type { Meta, StoryObj } from "@storybook/react-vite";
import AddCurrentLocationButton from "./AddCurrentLocationButton";

const meta = {
  title: "Components/Main/Plan/AddCurrentLocationButton",
  component: AddCurrentLocationButton,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#111827",
        },
      ],
    },
  },
  tags: ["autodocs"],
  args: {
    handleAddCurrentLocation: () => console.log("handleAddCurrentLocation"),
  },
} satisfies Meta<typeof AddCurrentLocationButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    handleAddCurrentLocation: () => console.log("handleAddCurrentLocation"),
  },
};

export const InForm: Story = {
  args: {
    handleAddCurrentLocation: () => console.log("handleAddCurrentLocation"),
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-4">
          <div className="typo-title-02">위치 선택</div>
          <Story />
        </div>
      </div>
    ),
  ],
};

export const MultipleButtons: Story = {
  args: {
    handleAddCurrentLocation: () => console.log("handleAddCurrentLocation"),
  },
  render: (args) => (
    <div className="space-y-4">
      <AddCurrentLocationButton {...args} />
      <AddCurrentLocationButton {...args} />
    </div>
  ),
};
