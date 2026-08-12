import { ErrorState } from "../components/common/ErrorState";
import { PageTransition } from "../components/layout/PageTransition";

export function NotFoundPage() {
  return (
    <PageTransition>
      <ErrorState type="404" fullScreen />
    </PageTransition>
  );
}
