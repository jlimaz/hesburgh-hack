import { useSignupStore } from './signupStore';

const initialState = {
  firstName: '', lastName: '', email: '', nationality: '', dateOfBirth: '',
  universityName: '', studentId: '', enrollmentYear: 0, program: '',
  bankCountry: '', bankName: '', accountNumber: '', swiftCode: '',
  streetAddress: '', addressLine2: '', city: '', state: '', zip: '',
  housingType: '', isMailingAddress: false,
  currentStep: 1,
};

beforeEach(() => {
  useSignupStore.setState(initialState);
});

describe('useSignupStore', () => {
  it('initializes with currentStep 1', () => {
    expect(useSignupStore.getState().currentStep).toBe(1);
  });

  it('initializes all string fields as empty string', () => {
    const state = useSignupStore.getState();
    expect(state.firstName).toBe('');
    expect(state.email).toBe('');
    expect(state.swiftCode).toBe('');
  });

  it('initializes enrollmentYear as 0', () => {
    expect(useSignupStore.getState().enrollmentYear).toBe(0);
  });

  it('initializes isMailingAddress as false', () => {
    expect(useSignupStore.getState().isMailingAddress).toBe(false);
  });

  it('setField updates a string field', () => {
    useSignupStore.getState().setField('firstName', 'Alice');
    expect(useSignupStore.getState().firstName).toBe('Alice');
  });

  it('setField updates a number field', () => {
    useSignupStore.getState().setField('enrollmentYear', 2023);
    expect(useSignupStore.getState().enrollmentYear).toBe(2023);
  });

  it('setField updates a boolean field', () => {
    useSignupStore.getState().setField('isMailingAddress', true);
    expect(useSignupStore.getState().isMailingAddress).toBe(true);
  });

  it('setStep updates currentStep', () => {
    useSignupStore.getState().setStep(3);
    expect(useSignupStore.getState().currentStep).toBe(3);
  });
});
