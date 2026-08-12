import { ErrorState } from "../components/common/ErrorState";
import { PageTransition } from "../components/layout/PageTransition";

export function OfflinePage() {
  return (
    <PageTransition>
      <ErrorState type="offline" fullScreen />
    </PageTransition>
  );
}
