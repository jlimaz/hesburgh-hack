import { create } from 'zustand';

interface SignupState {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  dateOfBirth: string;
  universityName: string;
  studentId: string;
  enrollmentYear: number;
  program: string;
  bankCountry: string;
  bankName: string;
  accountNumber: string;
  swiftCode: string;
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  housingType: string;
  isMailingAddress: boolean;
  currentStep: number;
  setField: (
    field: keyof Omit<SignupState, 'setField' | 'setStep'>,
    value: string | number | boolean,
  ) => void;
  setStep: (step: number) => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  firstName: '',
  lastName: '',
  email: '',
  nationality: '',
  dateOfBirth: '',
  universityName: '',
  studentId: '',
  enrollmentYear: 0,
  program: '',
  bankCountry: '',
  bankName: '',
  accountNumber: '',
  swiftCode: '',
  streetAddress: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
  housingType: '',
  isMailingAddress: false,
  currentStep: 1,
  setField: (field, value) => set({ [field]: value }),
  setStep: (step) => set({ currentStep: step }),
}));
