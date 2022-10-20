import { useEffect } from "react";

export const useEventListener = (
  targetElement = document,
  eventType = "",
  handler = () => {}
) => {
  useEffect(() => {
    //to take care of SSR (document is undefined in ssr)
    if (!targetElement) return;

    const isTargetElementRef = targetElement.hasOwnProperty("current");
    let el = targetElement;
    if (isTargetElementRef) el = targetElement.current;

    el.addEventListener(eventType, handler);
    return () => {
      el.removeEventListener(eventType, handler);
    };
  }, []);
};
