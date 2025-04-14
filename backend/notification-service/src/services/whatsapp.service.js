import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.META_WA_TOKEN_PERM;
const phoneNumberId = process.env.META_WA_PHONE_ID;
export async function sendWhatsApp(to, templateName, params) {
  try {
    const components = [];
    const fullPhone = `whatsapp:+${to.replace(/^\+?/, '')}`;

    console.log("PARAMS:", params.body);

    // Only include body since header was removed
    if (params.body && Array.isArray(params.body)) {
      components.push({
        type: 'body',
        parameters: params.body.map(val => ({
          type: 'text',
          text: val
        }))
      });
    }

    const payload = {
      messaging_product: 'whatsapp',
      to: fullPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_GB' },
        components
      }
    };
    console.log("Final Payload:", JSON.stringify(payload, null, 2));

    const res = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('WhatsApp message sent:', res.data);
    return { success: true, data: res.data };

  } catch (err) {
    console.error('Failed to send WhatsApp message:', err.response?.data || err.message);
    return { success: false, error: err.response?.data || err.message };
  }
}

