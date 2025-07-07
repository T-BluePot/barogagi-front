import type { ConfirmBottomModalProps } from "@/types/BottomModalTypes";

import { BottomModalLayout } from "@/components/layout/BottomModalLayout";
import { BottomModalHeader } from "./BottomModalHeader";
import { BottomModalDeleteButton } from "./BottomModalDeleteButton";

export const ConfirmBottomModal = ({
  children,
  withDelete, // 삭제 버튼 유무
  onDelete,
  ...layoutProps
}: ConfirmBottomModalProps) => {
  return (
    <BottomModalLayout {...layoutProps}>
      <BottomModalHeader
        variant="detail"
        title={layoutProps.title}
        onCancel={layoutProps.onCancel}
        onConfirm={layoutProps.onConfirm}
      />
      {children}
      {withDelete && <BottomModalDeleteButton onClick={onDelete} />}
    </BottomModalLayout>
  );
};
