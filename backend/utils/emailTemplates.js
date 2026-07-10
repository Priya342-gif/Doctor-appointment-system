const appointmentBookedEmail = (patientName, doctorName, date, time) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
  <h2 style="color:#3b82f6;">Appointment Confirmed 🎉</h2>
  <p>Hi <strong>${patientName}</strong>,</p>
  <p>Your appointment has been successfully booked.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr><td style="padding:8px;background:#f3f4f6;font-weight:bold;">Doctor</td><td style="padding:8px;">${doctorName}</td></tr>
    <tr><td style="padding:8px;background:#f3f4f6;font-weight:bold;">Date</td><td style="padding:8px;">${date}</td></tr>
    <tr><td style="padding:8px;background:#f3f4f6;font-weight:bold;">Time</td><td style="padding:8px;">${time}</td></tr>
  </table>
  <p style="color:#6b7280;">Please arrive 10 minutes early.</p>
  <p style="color:#6b7280;">Thank you for choosing DocBook!</p>
</div>`;

const appointmentAcceptedEmail = (patientName, doctorName, date, time) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
  <h2 style="color:#10b981;">Appointment Accepted ✅</h2>
  <p>Hi <strong>${patientName}</strong>,</p>
  <p>Dr. <strong>${doctorName}</strong> has accepted your appointment.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr><td style="padding:8px;background:#f3f4f6;font-weight:bold;">Date</td><td style="padding:8px;">${date}</td></tr>
    <tr><td style="padding:8px;background:#f3f4f6;font-weight:bold;">Time</td><td style="padding:8px;">${time}</td></tr>
  </table>
  <p style="color:#6b7280;">We look forward to seeing you!</p>
</div>`;

const appointmentCancelledEmail = (patientName, doctorName, date, reason) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
  <h2 style="color:#ef4444;">Appointment Cancelled ❌</h2>
  <p>Hi <strong>${patientName}</strong>,</p>
  <p>Your appointment with Dr. <strong>${doctorName}</strong> on <strong>${date}</strong> has been cancelled.</p>
  ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
  <p style="color:#6b7280;">You can book a new appointment anytime on DocBook.</p>
</div>`;

module.exports = { appointmentBookedEmail, appointmentAcceptedEmail, appointmentCancelledEmail };
