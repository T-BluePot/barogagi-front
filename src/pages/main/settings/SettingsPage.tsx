import { useSettingsQuery } from "@/hooks/queries/useSettingsQuery";
import { useUpdateSettingMutation } from "@/hooks/mutations/useUpdateSettingMutation";
import {
  SETTINGS_PAGE_TEXT,
  NOTIFICATION_SETTINGS,
} from "@/constants/texts/main/settings";
import SettingsSection from "@/components/main/settings/SettingsSection";
import SettingsToggleItem from "@/components/main/settings/SettingsToggleItem";
import type { SettingType } from "@/api/types";

const SettingsPage = () => {
  const { data: settings, isLoading, isError } = useSettingsQuery();
  const updateSetting = useUpdateSettingMutation();

  const handleToggle = (type: SettingType, next: boolean) => {
    updateSetting.mutate({ type, isOn: next });
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-black text-white overflow-y-auto pb-10">
      <SettingsSection title={SETTINGS_PAGE_TEXT.NOTIFICATION_SECTION.TITLE}>
        {NOTIFICATION_SETTINGS.map((config) => {
          // 서버가 내려주지 않은 항목은 기본 ON (백엔드의 기본값 정책과 동일)
          const checked = settings?.[config.type] ?? true;
          // 초기 로딩 중이거나 해당 항목이 변경 처리 중일 때만 비활성화
          const isUpdatingThis =
            updateSetting.isPending &&
            updateSetting.variables?.type === config.type;

          return (
            <SettingsToggleItem
              key={config.type}
              label={config.label}
              description={config.description}
              checked={checked}
              // 로드 실패 시 baseline 을 신뢰할 수 없으므로 조작 차단
              disabled={isLoading || isError || isUpdatingThis}
              onChange={(next) => handleToggle(config.type, next)}
            />
          );
        })}
      </SettingsSection>

      {isError && (
        <p className="typo-caption text-alert-red px-6 mt-3 text-center">
          {SETTINGS_PAGE_TEXT.ERROR}
        </p>
      )}
    </div>
  );
};

export default SettingsPage;
