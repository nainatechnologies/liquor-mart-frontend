import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { PaymentGateway } from '../components/checkout/PaymentGateway';
import { DummyQR } from '../components/checkout/DummyQR';

vi.mock('../context/ToastContext', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  })
}));

describe('PaymentGateway & DummyQR', () => {
  const mockOnSuccess = vi.fn();
  const mockOnDismiss = vi.fn();
  const mockOnMockSuccess = vi.fn();
  const mockOnMockFailure = vi.fn();
  const mockOnCheckStatus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Dummy QR Mode', () => {
    it('renders DummyQR when mockMode is true', () => {
      render(
        <PaymentGateway
          amount={500}
          currency="INR"
          orderId="HC-12345"
          mockMode={true}
          onSuccess={mockOnSuccess}
          onDismiss={mockOnDismiss}
          onMockSuccess={mockOnMockSuccess}
          onMockFailure={mockOnMockFailure}
        />
      );

      expect(screen.getByText('Demo QR — Not a Real Payment')).toBeInTheDocument();
      expect(screen.getByText('Simulate Success')).toBeInTheDocument();
      expect(screen.getByText('Simulate Failure')).toBeInTheDocument();
    });

    it('calls onMockSuccess when simulate success is clicked', async () => {
      render(
        <PaymentGateway
          amount={500}
          currency="INR"
          orderId="HC-12345"
          mockMode={true}
          onSuccess={mockOnSuccess}
          onDismiss={mockOnDismiss}
          onMockSuccess={mockOnMockSuccess}
          onMockFailure={mockOnMockFailure}
        />
      );

      fireEvent.click(screen.getByText('Simulate Success'));
      await waitFor(() => {
        expect(mockOnMockSuccess).toHaveBeenCalled();
      });
    });

    it('calls onMockFailure when simulate failure is clicked', async () => {
      render(
        <PaymentGateway
          amount={500}
          currency="INR"
          orderId="HC-12345"
          mockMode={true}
          onSuccess={mockOnSuccess}
          onDismiss={mockOnDismiss}
          onMockSuccess={mockOnMockSuccess}
          onMockFailure={mockOnMockFailure}
        />
      );

      fireEvent.click(screen.getByText('Simulate Failure'));
      await waitFor(() => {
        expect(mockOnMockFailure).toHaveBeenCalled();
      });
    });
  });

  describe('Production/Real QR Mode', () => {
    it('renders real QR when qrCodeUrl is provided and mockMode is false', () => {
      render(
        <PaymentGateway
          amount={500}
          currency="INR"
          orderId="HC-12345"
          qrCodeUrl="https://example.com/qr.png"
          mockMode={false}
          onSuccess={mockOnSuccess}
          onDismiss={mockOnDismiss}
          onMockSuccess={mockOnMockSuccess}
          onMockFailure={mockOnMockFailure}
          onCheckStatus={mockOnCheckStatus}
        />
      );

      expect(screen.queryByText('Demo QR — Not a Real Payment')).not.toBeInTheDocument();
      expect(screen.getByText('Scan to Pay')).toBeInTheDocument();
      
      const qrImage = screen.getByRole('img');
      expect(qrImage).toHaveAttribute('src', 'https://example.com/qr.png');
      expect(qrImage).toHaveAttribute('alt', 'Payment QR code for order HC-12345');

      fireEvent.click(screen.getByText('Check Payment Status'));
      expect(mockOnCheckStatus).toHaveBeenCalled();
    });
  });
});

// Since full Checkout integration tests require complex context mocks (Auth, Cart, UI, Toast, Router),
// this file covers the critical Payment abstraction component states as requested.
// Scenarios for successful verification, network failure, etc. can be verified via E2E or with extended mocks.
