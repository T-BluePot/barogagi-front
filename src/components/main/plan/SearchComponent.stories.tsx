import { useState } from "react";
import { SearchComponent } from "./SearchComponent";
import { mockRegions } from "@/mock/regions";

export default {
  title: "Components/Main/Plan/SearchComponent",
  component: SearchComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  render: () => {
    const [searchValue, setSearchValue] = useState("");

    return (
      <div className="h-screen max-h-[600px] w-full max-w-md mx-auto p-4">
        <SearchComponent
          HeaderContentsProps={{
            searchInputProps: {
              value: searchValue,
              setValue: setSearchValue,
              onClearSearchInput: () => setSearchValue(""),
              searchPlaceholder: "지역을 검색해보세요",
            },
            handleAddCurrentLocation: () =>
              console.log("Current location added"),
          }}
          regions={mockRegions}
          handleSelectRegion={(regionNum) =>
            console.log("Region selected:", regionNum)
          }
        />
      </div>
    );
  },
};

export const WithSearchValue = {
  render: () => {
    const [searchValue, setSearchValue] = useState("서울");

    return (
      <div className="h-screen max-h-[600px] w-full max-w-md mx-auto p-4">
        <SearchComponent
          HeaderContentsProps={{
            searchInputProps: {
              value: searchValue,
              setValue: setSearchValue,
              onClearSearchInput: () => setSearchValue(""),
              searchPlaceholder: "지역을 검색해보세요",
            },
            handleAddCurrentLocation: () =>
              console.log("Current location added"),
          }}
          regions={mockRegions}
          handleSelectRegion={(regionNum) =>
            console.log("Region selected:", regionNum)
          }
        />
      </div>
    );
  },
};
