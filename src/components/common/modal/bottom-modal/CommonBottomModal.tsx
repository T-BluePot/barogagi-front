import { BottomModalLayout } from "@/components/common/modal/bottom-modal/BottomModalLayout";
import { BottomModalHeader } from "./BottomModalHeader";
import type { CommonBottomModalProps } from "@/types/BottomModalTypes";

export const CommonBottomModal = ({
  children,
  ...layoutProps
}: CommonBottomModalProps) => {
  return (
    <BottomModalLayout {...layoutProps}>
      <BottomModalHeader variant="title" title={layoutProps.title} />
      {children}
    </BottomModalLayout>
  );
};
