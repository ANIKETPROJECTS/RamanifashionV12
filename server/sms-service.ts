const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID;
const SMS_BASE_URL = "https://smsfortius.org/V2/apikey.php";

const TEMPLATE_IDS = {
  loginOtp:             process.env.SMS_TEMPLATE_ID || '1707177503961928847',
  orderConfirmation:    '1707177503979503746',
  paymentFailure:       '1707177503988898043',
  orderAccepted:        '1707177503995349512',
  orderCancellation:    '1707177504012730703',
  orderShipped:         '1707177504025926345',
  orderDelivered:       '1707177504037044153',
};

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  if (cleaned.length === 10) {
    return '91' + cleaned;
  }

  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return cleaned;
  }

  throw new Error(`Invalid phone number format. Expected 10-digit number or 12-digit number with country code, got: ${phone} (cleaned: ${cleaned})`);
}

async function sendSMS(phoneNumber: string, templateid: string, message: string): Promise<boolean> {
  if (!SMS_API_KEY || !SMS_SENDER_ID) {
    throw new Error('SMS API credentials not configured');
  }

  const formattedPhone = formatPhoneNumber(phoneNumber);

  const params = new URLSearchParams({
    apikey: SMS_API_KEY,
    senderid: SMS_SENDER_ID,
    templateid,
    number: formattedPhone,
    message,
  });

  const url = `${SMS_BASE_URL}?${params.toString()}`;

  const response = await fetch(url, { method: 'GET' });
  const responseText = await response.text();

  console.log('SMS API response status:', response.status, 'body:', responseText);

  if (!response.ok) {
    throw new Error(`SMS API HTTP error ${response.status}: ${responseText.slice(0, 200)}`);
  }

  if (responseText.toLowerCase().includes('invalid') || responseText.toLowerCase().includes('failure')) {
    throw new Error(`SMS API error: ${responseText}`);
  }

  return true;
}

export async function sendSMSOTP(phoneNumber: string, otp: string): Promise<boolean> {
  if (!SMS_API_KEY || !SMS_SENDER_ID) {
    throw new Error('SMS API credentials not configured');
  }

  const message = `Ramani Fashion: Your Login OTP is ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;

  try {
    console.log('Sending SMS OTP to:', phoneNumber, 'OTP:', otp);
    const result = await sendSMS(phoneNumber, TEMPLATE_IDS.loginOtp, message);
    console.log('SMS OTP sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending SMS OTP:', error);
    throw error;
  }
}

export async function sendOrderConfirmationSMS(phoneNumber: string, orderNumber: string): Promise<boolean> {
  const message = `Ramani Fashion: Order #${orderNumber} confirmed and payment received successfully. Thank you for shopping with us!`;
  try {
    console.log('Sending order confirmation SMS to:', phoneNumber, 'Order:', orderNumber);
    const result = await sendSMS(phoneNumber, TEMPLATE_IDS.orderConfirmation, message);
    console.log('Order confirmation SMS sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending order confirmation SMS:', error);
    return false;
  }
}

export async function sendPaymentFailureSMS(phoneNumber: string, orderNumber: string): Promise<boolean> {
  const message = `Ramani Fashion: Payment for Order #${orderNumber} was unsuccessful. Please retry to complete your purchase.`;
  try {
    console.log('Sending payment failure SMS to:', phoneNumber, 'Order:', orderNumber);
    const result = await sendSMS(phoneNumber, TEMPLATE_IDS.paymentFailure, message);
    console.log('Payment failure SMS sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending payment failure SMS:', error);
    return false;
  }
}

export async function sendOrderAcceptedSMS(phoneNumber: string, orderNumber: string): Promise<boolean> {
  const message = `Ramani Fashion: Your order #${orderNumber} has been accepted and is now being processed. We'll keep you updated.`;
  try {
    console.log('Sending order accepted SMS to:', phoneNumber, 'Order:', orderNumber);
    const result = await sendSMS(phoneNumber, TEMPLATE_IDS.orderAccepted, message);
    console.log('Order accepted SMS sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending order accepted SMS:', error);
    return false;
  }
}

export async function sendOrderCancelledSMS(phoneNumber: string, orderNumber: string): Promise<boolean> {
  const message = `Ramani Fashion: Your order #${orderNumber} has been cancelled as requested. For help, please contact our support team.`;
  try {
    console.log('Sending order cancellation SMS to:', phoneNumber, 'Order:', orderNumber);
    const result = await sendSMS(phoneNumber, TEMPLATE_IDS.orderCancellation, message);
    console.log('Order cancellation SMS sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending order cancellation SMS:', error);
    return false;
  }
}

export async function sendOrderShippedSMS(phoneNumber: string, orderNumber: string): Promise<boolean> {
  const message = `Ramani Fashion: Order #${orderNumber} has been shipped. Track your delivery as it moves to you.`;
  try {
    console.log('Sending order shipped SMS to:', phoneNumber, 'Order:', orderNumber);
    const result = await sendSMS(phoneNumber, TEMPLATE_IDS.orderShipped, message);
    console.log('Order shipped SMS sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending order shipped SMS:', error);
    return false;
  }
}

export async function sendOrderDeliveredSMS(phoneNumber: string, orderNumber: string): Promise<boolean> {
  const message = `Ramani Fashion: Order #${orderNumber} has been delivered successfully. Thank you for choosing Ramani Fashion!`;
  try {
    console.log('Sending order delivered SMS to:', phoneNumber, 'Order:', orderNumber);
    const result = await sendSMS(phoneNumber, TEMPLATE_IDS.orderDelivered, message);
    console.log('Order delivered SMS sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending order delivered SMS:', error);
    return false;
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
