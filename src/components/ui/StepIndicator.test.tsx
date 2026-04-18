import { render, screen } from '@testing-library/react';
import { StepIndicator } from './StepIndicator';

describe('StepIndicator', () => {
  it('renders all 4 step labels', () => {
    render(<StepIndicator currentStep={1} />);
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('University')).toBeInTheDocument();
    expect(screen.getByText('Banking')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('shows step number for current and upcoming steps', () => {
    render(<StepIndicator currentStep={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('hides numbers for completed steps', () => {
    render(<StepIndicator currentStep={3} />);
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('applies brand-orange color to completed and current steps', () => {
    const { container } = render(<StepIndicator currentStep={2} />);
    const items = container.querySelectorAll('li');
    expect(items[0].className).toContain('text-brand-orange');
    expect(items[1].className).toContain('text-brand-orange');
    expect(items[2].className).not.toContain('text-brand-orange');
  });
});
