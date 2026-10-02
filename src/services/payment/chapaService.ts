import {CHAPA_SECRET_KEY} from '@env';

const CHAPA_INIT_URL = 'https://api.chapa.co/v1/transaction/initialize';
const CHAPA_VERIFY_URL = 'https://api.chapa.co/v1/transaction/verify';

interface ChapaCustomer {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
}

interface InitializePaymentParams {
  amount: number;
  merchantReference: string;
  customer: ChapaCustomer;
  orderId?: string;
}

export type InitializePaymentResult = {
  checkoutUrl: string;
  txRef: string;
};

interface ChapaInitResponse {
  status: string;
  message?: string;
  data?: {
    checkout_url?: string;
  };
}

interface ChapaVerifyResponse {
  status: string;
  message?: string;
  data?: {
    status?: string;
    amount?: number | string;
    currency?: string;
    tx_ref?: string;
    reference?: string;
  };
}

/**
 * Initialize a hosted payment (v1).
 * Uses your merchantReference as tx_ref.
 */
export const initializeChapaPayment = async ({
  amount,
  merchantReference,
  customer,
}: InitializePaymentParams): Promise<InitializePaymentResult> => {
  if (!CHAPA_SECRET_KEY) {
    throw new Error('Chapa secret key is not configured.');
  }

  const response = await fetch(CHAPA_INIT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: String(amount),
      currency: 'ETB',
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone_number: customer.phone_number,
      tx_ref: merchantReference,
      // Optional – add when you have a backend:
      // callback_url: 'https://your-api.com/chapa/callback',
      // return_url: 'https://your-api.com/chapa/return',
    }),
  });

  const data = (await response.json()) as ChapaInitResponse;

  console.log('Chapa init status:', response.status);
  console.log('Chapa init response:', data);

  if (!response.ok || data.status !== 'success') {
    throw new Error(
      data.message || `Chapa payment initialization failed (${response.status}).`,
    );
  }

  const checkoutUrl = data.data?.checkout_url;
  if (!checkoutUrl) {
    throw new Error('Chapa did not return a checkout URL.');
  }

  return {
    checkoutUrl,
    txRef: merchantReference,
  };
};

/**
 * Verify payment by your tx_ref (merchant reference).
 */
export const verifyChapaPayment = async (txRef: string): Promise<boolean> => {
  if (!CHAPA_SECRET_KEY) {
    throw new Error('Chapa secret key is not configured.');
  }

  const response = await fetch(
    `${CHAPA_VERIFY_URL}/${encodeURIComponent(txRef)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      },
    },
  );

  const data = await response.json();

  console.log('Chapa verify status:', response.status, 'tx_ref:', txRef);
  console.log('Chapa verify response:', data);
  console.log('Payment data.status:', data?.data?.status);

  if (!response.ok || data.status !== 'success' || !data.data) {
    return false;
  }

  const paymentStatus = String(data.data.status || '').toLowerCase();

  // Accept common success values from Chapa
  const successStatuses = ['success', 'successful', 'paid', 'completed'];

  return successStatuses.includes(paymentStatus);
};
/**
 * Poll verify a few times (after user finishes paying).
 */
export const confirmPayment = async (
  txRef: string,
  attempts = 3,
  delayMs = 4000,
): Promise<boolean> => {
  for (let i = 0; i < attempts; i++) {
    const ok = await verifyChapaPayment(txRef);
    if (ok) {
      return true;
    }
    if (i < attempts - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  return false;
};