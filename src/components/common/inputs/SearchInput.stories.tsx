import type { Meta, StoryObj } from "@storybook/react-vite";

import { SearchInput } from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "Components/Common/Inputs/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  args: {
    value: "",
    setValue: (next: string) => console.log("Set value:", next),
    onClearSearchInput: () => console.log("Clear search input"),
    searchPlaceholder: "검색어를 입력하세요",
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    value: "",
    searchPlaceholder: "검색어를 입력하세요",
  },
};

export const WithValue: Story = {
  args: {
    value: "예시 검색어",
    searchPlaceholder: "검색어를 입력하세요",
  },
};
