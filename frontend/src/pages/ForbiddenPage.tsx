import { ErrorState } from "../components/common/ErrorState";
import { PageTransition } from "../components/layout/PageTransition";

export function ForbiddenPage() {
  return (
    <PageTransition>
      <ErrorState type="403" fullScreen />
    </PageTransition>
  );
}
