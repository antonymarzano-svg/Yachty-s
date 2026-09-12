import { useCallback } from "react";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

/**
 * Thin wrapper around Capacitor Haptics.
 *
 * On native iOS/Android (once wrapped with Capacitor) this drives the real
 * Taptic/vibration engine. In a plain browser, Capacitor's web
 * implementation silently falls back to `navigator.vibrate` (or a no-op
 * where unsupported), so it's always safe to call these.
 */
export function useHaptics() {
  const light = useCallback(() => {
    void Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
  }, []);

  const medium = useCallback(() => {
    void Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
  }, []);

  const success = useCallback(() => {
    void Haptics.notification({ type: NotificationType.Success }).catch(
      () => {},
    );
  }, []);

  const selectionChanged = useCallback(() => {
    void Haptics.selectionChanged().catch(() => {});
  }, []);

  return { light, medium, success, selectionChanged };
}
