import { SendMoneyFlowShell } from '@/components/transfer/SendMoneyFlowShell';

export default function TransferLayout({ children }: { children: React.ReactNode }) {
  return <SendMoneyFlowShell>{children}</SendMoneyFlowShell>;
}
