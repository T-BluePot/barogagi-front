import { Component, type ErrorInfo, type ReactNode } from "react";

import FullScreenNotice from "./FullScreenNotice";
import { ERROR_SCREEN_TEXT } from "@/constants/texts/common/errorScreen";
import { restartApp } from "@/utils/restartApp";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

/**
 * 렌더 예외 폴백 (ErrorBoundary).
 *
 * 이게 없으면 렌더 중 예외가 나는 순간 React 가 트리를 통째로 버려 **흰 화면**이 된다.
 * `react-error-boundary` 를 쓰지 않고 클래스 컴포넌트로 직접 작성한다(의존성 추가 없음).
 *
 * ⚠️ 폴백은 store 를 거치지 않고 `FullScreenNotice` 를 **직접** 렌더한다.
 *    렌더 중 예외 상황에서 store 업데이트는 신뢰할 수 없다.
 * ℹ️ StrictMode(dev)에서는 componentDidCatch 로그가 2회 찍힌다 — 정상 동작이다.
 */
class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[AppErrorBoundary] 렌더 예외", error, errorInfo);
    // TODO: 에러 리포팅 도구(Sentry 등) 도입 시 여기서 전송한다
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const text = ERROR_SCREEN_TEXT.render;

    return (
      <FullScreenNotice
        kind="render"
        title={text.TITLE}
        description={text.DESCRIPTION}
        actionLabel={text.ACTION_LABEL}
        onAction={restartApp}
      />
    );
  }
}

export default AppErrorBoundary;
