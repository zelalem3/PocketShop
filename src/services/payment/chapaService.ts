import {CHAPA_SECRET_KEY} from '@env';

const CHAPA_HOSTED_PAYMENT_URL =
  'https://api.chapa.global/v2/payments/hosted';

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

interface ChapaInitializeResponse {
  status: string;
  message?: string;
  data?: {
    checkout_url?: string;
    created_at?: string;
    expires_at?: string;
  };
}

export const initializeChapaPayment = async ({
  amount,
  merchantReference,
  customer,
  orderId,
}: InitializePaymentParams): Promise<string> => {
  if (!CHAPA_SECRET_KEY) {
    throw new Error(
      'Chapa secret key is not configured.',
    );
  }
  console.log('CHAPA_SECRET_KEY exists?', !!CHAPA_SECRET_KEY);
console.log('Key length:', CHAPA_SECRET_KEY?.length);
console.log('Key starts with:', CHAPA_SECRET_KEY?.substring(0, 12));

  const response = await fetch(
    CHAPA_HOSTED_PAYMENT_URL,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'ETB',
        merchant_reference: merchantReference,
        customer,
        meta: {
          order_id: orderId ?? merchantReference,
          source: 'pocketshop-mobile',
        },
      }),
    },
  );

  const data =
    (await response.json()) as ChapaInitializeResponse;

  console.log('Chapa response status:', response.status);
  console.log('Chapa response:', data);

  if (!response.ok || data.status !== 'success') {
    throw new Error(
      data.message ||
        `Chapa payment initialization failed (${response.status}).`,
    );
  }

  const checkoutUrl = data.data?.checkout_url;

  if (!checkoutUrl) {
    throw new Error(
      'Chapa did not return a checkout URL.',
    );
  }

  return checkoutUrl;
};