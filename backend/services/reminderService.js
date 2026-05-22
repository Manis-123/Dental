import ReminderLog from '../models/ReminderLog.js';

const formatMessage = (appointment) => {
  const date = new Date(appointment.date).toLocaleDateString('en-PK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  return `DentalCare reminder: Appointment on ${date} at ${appointment.time} with Dr. ${appointment.doctor?.name || 'clinic'}. Please arrive 10 min early.`;
};

export const sendAppointmentReminder = async (appointment, channel = 'whatsapp') => {
  const phone = appointment.patient?.phone?.replace(/\D/g, '');
  if (!phone) throw new Error('Patient phone number required');

  const message = formatMessage(appointment);
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM || process.env.TWILIO_PHONE_FROM;

  let status = 'mock';
  let error = null;

  if (sid && token && from) {
    try {
      const to =
        channel === 'whatsapp'
          ? `whatsapp:${phone.startsWith('92') ? '+' : '+92'}${phone.replace(/^0/, '')}`
          : `+${phone.startsWith('92') ? '' : '92'}${phone.replace(/^0/, '')}`;

      const auth = Buffer.from(`${sid}:${token}`).toString('base64');
      const body = new URLSearchParams({
        From: channel === 'whatsapp' && !from.startsWith('whatsapp:') ? `whatsapp:${from}` : from,
        To: to,
        Body: message,
      });

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Twilio send failed');
      }
      status = 'sent';
    } catch (err) {
      status = 'failed';
      error = err.message;
    }
  }

  const log = await ReminderLog.create({
    appointment: appointment._id,
    patientPhone: appointment.patient?.phone,
    channel: sid && token && from ? channel : 'mock',
    message,
    status,
    error,
  });

  return { log, status, message, mock: status === 'mock' };
};
