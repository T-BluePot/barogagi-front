// 아이콘 키값 타입
export type IconKey = "Time" | "Place" | "Note";

// 요소 색상 타입
export type ColorState = "default" | "placeholder";

// 아이콘 타입: 키 => 아이콘 매핑 / JSX
export type IconType =
  | { type: "key"; name: IconKey; state: ColorState }
  | { type: "node"; node: React.ReactElement };
