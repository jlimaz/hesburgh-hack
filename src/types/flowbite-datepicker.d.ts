declare module 'flowbite-datepicker' {
  export class Datepicker {
    constructor(element: HTMLElement, options?: Record<string, unknown>);
    destroy(): void;
    setDate(...args: unknown[]): void;
    hide(): void;
    show(): void;
    get active(): boolean;
    get pickerElement(): HTMLElement | undefined;
  }
  export class DateRangePicker {
    constructor(element: HTMLElement, options?: Record<string, unknown>);
    destroy(): void;
  }
}
