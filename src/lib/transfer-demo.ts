import { FEE_USD } from '@/lib/quote';

/** Demo PIX payment + confirmation — shared between payment and confirm screens */
export const PIX_TRANSFER_DEMO = {
  amountBrl: '101.00',
  amountUsd: '20.00',
  rateLabel: '1 USD = 5.05 BRL',
  referenceId: 'BR-7XK9-DEMO',
  pixKey:
    '00020126580014br.gov.bcb.pix0136a629532e-7693-4846-852d-1bbf553d6d065204000053039865802BR5913BANCO DEMO6009SAO PAULO62070503***6304ABCD',
} as const;

export function buildDemoInvoiceText(): string {
  const lines = [
    'REMES — TRANSFER INVOICE (DEMO)',
    '================================',
    '',
    `Reference: ${PIX_TRANSFER_DEMO.referenceId}`,
    `Date: ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`,
    '',
    'Summary',
    '-------',
    `Amount paid (PIX): ${PIX_TRANSFER_DEMO.amountBrl} BRL`,
    `Recipient receives: $${PIX_TRANSFER_DEMO.amountUsd} USD`,
    `Exchange rate: ${PIX_TRANSFER_DEMO.rateLabel}`,
    `Fee: $${FEE_USD.toFixed(2)} USD`,
    '',
    'Status: Confirmed (demo)',
    '',
    'This document is a demo placeholder and not a legal invoice.',
  ];
  return lines.join('\n');
}
