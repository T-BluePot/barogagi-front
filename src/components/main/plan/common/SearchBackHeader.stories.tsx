import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import SearchBackHeader from "./SearchBackHeader";

const meta = {
  title: "Components/Main/Plan/SearchBackHeader",
  component: SearchBackHeader,
  tags: ["autodocs"],
  args: {
    onClick: () => console.log("Back button clicked"),
    searchProps: {
      searchPlaceholder: "가고 싶은 장소를 검색해보세요!",
      value: "",
      setValue: (next: string) => console.log("Set value:", next),
      onClearSearchInput: () => console.log("Clear search input"),
    },
  },
} satisfies Meta<typeof SearchBackHeader>;

export default meta;
type Story = StoryObj<typeof SearchBackHeader>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>("");

    const handleClearValue = () => setValue("");
    return (
      <SearchBackHeader
        {...args}
        searchProps={{
          ...args.searchProps,
          value: value,
          setValue: setValue,
          onClearSearchInput: handleClearValue,
        }}
      />
    );
  },
};
