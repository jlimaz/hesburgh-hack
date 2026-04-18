import { SignupFlowShell } from '@/components/signup/SignupFlowShell';

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <SignupFlowShell>{children}</SignupFlowShell>;
}
