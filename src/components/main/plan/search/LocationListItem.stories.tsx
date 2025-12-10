import type { Meta, StoryObj } from "@storybook/react-vite";
import LocationListItem from "./LocationListItem";

import { mockLocations } from "@/mock/locations";

const meta: Meta<typeof LocationListItem> = {
  title: "Components/Main/Plan/Search/LocationListItem",
  component: LocationListItem,
  tags: ["autodocs"],
  args: {
    location: mockLocations[0],
    addModalProps: {
      handleConfirm: (place) => console.log("Location selected:", place),
    },
  },
};

export default meta;
type Story = StoryObj<typeof LocationListItem>;

export const Default: Story = {};
