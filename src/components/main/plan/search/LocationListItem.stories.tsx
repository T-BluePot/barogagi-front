import type { Meta, StoryObj } from "@storybook/react-vite";
import LocationListItem from "./LocationListItem";

const meta: Meta<typeof LocationListItem> = {
  title: "Components/Main/Plan/Search/LocationListItem",
  component: LocationListItem,
  tags: ["autodocs"],
  args: {
    location: {
      placeName: "브런치 카페 그라운드",
      addressName: "경기 부천시 원미구 조마루로386번길 22",
    },
    addModalProps: {
      handleConfirm: (place) => console.log("Location selected:", place),
    },
  },
};

export default meta;
type Story = StoryObj<typeof LocationListItem>;

export const Default: Story = {};
