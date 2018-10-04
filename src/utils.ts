/**
 * Returns true if we're running in a standard browser and not a web worker or
 * react-native application wrapper.
 */
function isBrowser() {
  if (
    typeof navigator !== "undefined" &&
    (
      navigator.product === "ReactNative" ||
      navigator.product === "NativeScript" ||
      navigator.product === "NS"
    )
  ) {
    return false;
  }

  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined"
  );
}