export const isButton = (
  element: HTMLElement
): element is HTMLButtonElement => {
  if (element instanceof HTMLButtonElement) return true;
  return false;
};

export const isInput = (element: HTMLElement): element is HTMLInputElement => {
  if (element instanceof HTMLInputElement) return true;
  return false;
};

export const isHtmlElement = (
  target: EventTarget | null
): target is HTMLElement => {
  if (target instanceof HTMLElement) return true;
  return false;
};
