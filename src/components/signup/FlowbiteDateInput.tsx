'use client';

import { Datepicker } from 'flowbite-datepicker';
import { useEffect, useRef } from 'react';

function isoFromDetailDate(d: Date | undefined): string {
  if (!d || !(d instanceof Date) || Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isoStringToLocalDate(iso: string): Date | null {
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [y, m, d] = parts;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

type FlowbiteDateInputProps = {
  id: string;
  name?: string;
  value: string;
  onChange: (iso: string) => void;
  maxDate: Date;
  className?: string;
  autoComplete?: string;
};

export function FlowbiteDateInput({
  id,
  name = 'bday',
  value,
  onChange,
  maxDate,
  className,
  autoComplete = 'bday',
}: FlowbiteDateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<Datepicker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const picker = new Datepicker(el, {
      autohide: true,
      format: 'mm/dd/yyyy',
      maxDate,
      /** Use direct hide on outside click instead of blur-based update (more reliable with read-only input). */
      updateOnBlur: false,
      showOnFocus: true,
      showOnClick: true,
    });
    pickerRef.current = picker;

    const onChangeDate = (ev: Event) => {
      const e = ev as CustomEvent<{ date: Date }>;
      onChangeRef.current(isoFromDetailDate(e.detail?.date));
    };
    el.addEventListener('changeDate', onChangeDate);

    const isPopoverOpen = () => {
      const pe = pickerRef.current?.pickerElement;
      return !!(pe && !pe.classList.contains('hidden'));
    };

    const onDocPointerDown = (ev: PointerEvent) => {
      const p = pickerRef.current;
      if (!p) return;
      if (!isPopoverOpen()) return;

      const pe = p.pickerElement;
      if (!pe) return;

      const path = ev.composedPath();
      const inside = path.some((node) => {
        if (node === el || node === pe) return true;
        if (node instanceof Node && (el.contains(node) || pe.contains(node))) return true;
        return false;
      });
      if (inside) return;

      p.hide();
      el.blur();
    };
    document.addEventListener('pointerdown', onDocPointerDown, true);

    return () => {
      document.removeEventListener('pointerdown', onDocPointerDown, true);
      el.removeEventListener('changeDate', onChangeDate);
      picker.destroy();
      pickerRef.current = null;
    };
  }, [maxDate]);

  useEffect(() => {
    const p = pickerRef.current;
    if (!p) return;
    if (!value) {
      p.setDate({ clear: true });
      return;
    }
    const d = isoStringToLocalDate(value);
    if (d) p.setDate(d);
  }, [value]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      name={name}
      inputMode="none"
      autoComplete={autoComplete}
      placeholder="MM/DD/YYYY"
      readOnly
      className={className}
      aria-haspopup="dialog"
    />
  );
}
