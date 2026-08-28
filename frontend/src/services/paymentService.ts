export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentProvider {
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
}

class MockPaymentProvider implements PaymentProvider {
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    await new Promise((r) => setTimeout(r, 800));
    if (request.amount < 1000) {
      return { success: false, error: 'El monto mínimo de donación es $1.000 CLP' };
    }
    return {
      success: true,
      transactionId: `mock_txn_${Date.now()}`,
    };
  }
}

class WebpayProvider implements PaymentProvider {
  async processPayment(_request: PaymentRequest): Promise<PaymentResult> {
    throw new Error('Webpay no configurado. Configure VITE_PAYMENT_PROVIDER=mock');
  }
}

class MercadoPagoProvider implements PaymentProvider {
  async processPayment(_request: PaymentRequest): Promise<PaymentResult> {
    throw new Error('Mercado Pago no configurado');
  }
}

class StripeProvider implements PaymentProvider {
  async processPayment(_request: PaymentRequest): Promise<PaymentResult> {
    throw new Error('Stripe no configurado');
  }
}

function getProvider(): PaymentProvider {
  const provider = import.meta.env.VITE_PAYMENT_PROVIDER || 'mock';
  switch (provider) {
    case 'webpay': return new WebpayProvider();
    case 'mercadopago': return new MercadoPagoProvider();
    case 'stripe': return new StripeProvider();
    default: return new MockPaymentProvider();
  }
}

export const paymentService = {
  processPayment: (request: PaymentRequest) => getProvider().processPayment(request),
};
