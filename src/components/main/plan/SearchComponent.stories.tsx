import useState from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { SearchComponent } from "./SearchComponent";
import { mockRegions } from "@/mock/regions";

const meta = {
  title: "Components/Main/Plan/SearchComponent",
  component: SearchComponent,
  parameters: {
    layout: "fullscreen",
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
} satisfies Meta<typeof SearchComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    HeaderContentsProps: {
      searchInputProps: {
        value: "",
        setValue: action("setValue"),
        searchPlaceholder: "지역을 검색해주세요",
        onClearSearchInput: action("onClearSearchInput"),
      },
      handleAddCurrentLocation: action("handleAddCurrentLocation"),
    },
    regions: mockRegions,
    handleSelectRegion: action("handleSelectRegion"),
  },
  decorators: [
    (Story) => (
      <div className="h-screen max-h-[600px] w-full max-w-md mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export const WithSearchQuery: Story = {
  args: {
    HeaderContentsProps: {
      searchInputProps: {
        value: "서울",
        setValue: action("setValue"),
        searchPlaceholder: "지역을 검색해주세요",
        onClearSearchInput: action("onClearSearchInput"),
      },
      handleAddCurrentLocation: action("handleAddCurrentLocation"),
    },
    regions: mockRegions,
    handleSelectRegion: action("handleSelectRegion"),
  },
  decorators: [
    (Story) => (
      <div className="h-screen max-h-[600px] w-full max-w-md mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export const NoResults: Story = {
  args: {
    HeaderContentsProps: {
      searchInputProps: {
        value: "존재하지않는지역",
        setValue: action("setValue"),
        searchPlaceholder: "지역을 검색해주세요",
        onClearSearchInput: action("onClearSearchInput"),
      },
      handleAddCurrentLocation: action("handleAddCurrentLocation"),
    },
    regions: mockRegions,
    handleSelectRegion: action("handleSelectRegion"),
  },
  decorators: [
    (Story) => (
      <div className="h-screen max-h-[600px] w-full max-w-md mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export const Interactive: Story = {
  args: {
    HeaderContentsProps: {
      searchInputProps: {
        value: "",
        setValue: action("setValue"),
        searchPlaceholder: "지역을 검색해주세요",
        onClearSearchInput: action("onClearSearchInput"),
      },
      handleAddCurrentLocation: action("handleAddCurrentLocation"),
    },
    regions: mockRegions,
    handleSelectRegion: action("handleSelectRegion"),
  },
  render: () => {
    const [searchValue, setSearchValue] = useState("");

    return (
      <div className="h-screen max-h-[600px] w-full max-w-md mx-auto p-4">
        <SearchComponent
          HeaderContentsProps={{
            searchInputProps: {
              value: searchValue,
              setValue: setSearchValue,
              searchPlaceholder: "지역을 검색해주세요",
              onClearSearchInput: () => setSearchValue(""),
            },
            handleAddCurrentLocation: () => {
              action("handleAddCurrentLocation")();
              alert("현재 위치를 추가합니다.");
            },
          }}
          regions={mockRegions}
          handleSelectRegion={(regionNum) => {
            action("handleSelectRegion")(regionNum);
            const selectedRegion = mockRegions.find(
              (r) => r.REGION_NUM === regionNum
            );
            if (selectedRegion) {
              const regionText = [
                selectedRegion.REGION_LEVEL_1,
                selectedRegion.REGION_LEVEL_2,
                selectedRegion.REGION_LEVEL_3,
                selectedRegion.REGION_LEVEL_4,
              ]
                .filter(Boolean)
                .join(" ");
              setSearchValue(regionText);
            }
          }}
        />
      </div>
    );
  },
};
