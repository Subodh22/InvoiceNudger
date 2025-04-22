import { ReminderTemplate, ReminderLevel, ReminderStyle } from '../models/reminder';

type TemplateContent = {
  subject: string;
  body: string;
};

/**
 * Default templates organized by style and level
 */
export const DEFAULT_TEMPLATES: Record<ReminderStyle, Record<ReminderLevel, TemplateContent>> = {
  friendly: {
    'pre-due': {
      subject: 'Friendly Reminder: Invoice #{invoice_number} Due Soon',
      body: `
        <p>Hi {client_name},</p>
        <p>I hope you're doing well! This is just a friendly reminder that invoice #{invoice_number} for {invoice_amount} will be due on {due_date}.</p>
        <p>If you've already arranged for payment, please disregard this message. If you have any questions or need to discuss the payment, please don't hesitate to reach out.</p>
        <p>Thank you for your business!</p>
        <p>Best regards,</p>
      `
    },
    'due': {
      subject: 'Invoice #{invoice_number} is Due Today',
      body: `
        <p>Hi {client_name},</p>
        <p>I hope you're having a great day! Just a friendly reminder that invoice #{invoice_number} for {invoice_amount} is due today.</p>
        <p>If you've already made the payment, thank you very much and please disregard this message. If not, I'd appreciate it if you could process the payment at your earliest convenience.</p>
        <p>Please let me know if you have any questions or need assistance.</p>
        <p>Thanks again for your business!</p>
        <p>Best wishes,</p>
      `
    },
    'gentle': {
      subject: 'Gentle Reminder: Invoice #{invoice_number} is Overdue',
      body: `
        <p>Hi {client_name},</p>
        <p>I hope you're doing well! I wanted to check in about invoice #{invoice_number} for {invoice_amount} that was due on {due_date} ({days_overdue} days ago).</p>
        <p>It's possible that this payment has slipped through the cracks or there might be an issue that needs to be addressed. If you've already sent the payment, please let me know so I can check my records.</p>
        <p>If you have any questions or concerns about this invoice, please don't hesitate to reach out to me directly. I'm happy to help!</p>
        <p>Thanks so much for your attention to this matter.</p>
        <p>Best regards,</p>
      `
    },
    'firm': {
      subject: 'Important: Invoice #{invoice_number} is Now Overdue',
      body: `
        <p>Hi {client_name},</p>
        <p>I hope this email finds you well. I'm following up regarding invoice #{invoice_number} for {invoice_amount} that was due on {due_date} and is now {days_overdue} days overdue.</p>
        <p>Could you please provide an update on when I might expect payment? If there are any issues preventing timely payment, I'd be happy to discuss options.</p>
        <p>If you've already sent the payment, I appreciate your promptness and ask that you please send the payment details so I can confirm receipt.</p>
        <p>Thank you for your attention to this matter.</p>
        <p>Kind regards,</p>
      `
    },
    'assertive': {
      subject: 'Action Required: Invoice #{invoice_number} Significantly Overdue',
      body: `
        <p>Hi {client_name},</p>
        <p>I'm writing with some concern as invoice #{invoice_number} for {invoice_amount} is now {days_overdue} days past the due date of {due_date}.</p>
        <p>As this payment is significantly overdue, I need to request your immediate attention to this matter. Please arrange for payment as soon as possible.</p>
        <p>If there are circumstances preventing payment that I'm not aware of, please contact me right away so we can discuss a resolution.</p>
        <p>Thank you for your prompt attention. I look forward to resolving this matter quickly.</p>
        <p>Regards,</p>
      `
    },
    'final': {
      subject: 'FINAL NOTICE: Payment Required for Invoice #{invoice_number}',
      body: `
        <p>Hi {client_name},</p>
        <p>This is a final notice regarding invoice #{invoice_number} for {invoice_amount} that was due on {due_date} and is now {days_overdue} days overdue.</p>
        <p>Despite several previous reminders, this invoice remains unpaid. I request that you make payment in full immediately.</p>
        <p>If payment is not received within 3 business days, I may need to consider additional collection actions. I sincerely hope we can resolve this matter amicably.</p>
        <p>Please contact me immediately regarding your payment intentions.</p>
        <p>Regards,</p>
      `
    }
  },

  neutral: {
    'pre-due': {
      subject: 'Reminder: Invoice #{invoice_number} Due Soon',
      body: `
        <p>Hello {client_name},</p>
        <p>This is a reminder that invoice #{invoice_number} for {invoice_amount} is due on {due_date}.</p>
        <p>If you've already processed this payment, please disregard this message.</p>
        <p>Thank you for your business.</p>
        <p>Regards,</p>
      `
    },
    'due': {
      subject: 'Invoice #{invoice_number} Due Today',
      body: `
        <p>Hello {client_name},</p>
        <p>This is to inform you that invoice #{invoice_number} for {invoice_amount} is due today.</p>
        <p>Please process payment at your earliest convenience.</p>
        <p>If you have any questions, please contact me.</p>
        <p>Regards,</p>
      `
    },
    'gentle': {
      subject: 'Reminder: Invoice #{invoice_number} is Overdue',
      body: `
        <p>Hello {client_name},</p>
        <p>This is a reminder that invoice #{invoice_number} for {invoice_amount} was due on {due_date} and is now {days_overdue} days overdue.</p>
        <p>Please arrange for payment as soon as possible.</p>
        <p>If you have already sent payment, please notify me with the payment details.</p>
        <p>Regards,</p>
      `
    },
    'firm': {
      subject: 'Notice: Invoice #{invoice_number} Payment Overdue',
      body: `
        <p>Hello {client_name},</p>
        <p>Invoice #{invoice_number} for {invoice_amount} was due on {due_date} and is currently {days_overdue} days overdue.</p>
        <p>Please process this payment immediately or contact me to discuss payment arrangements.</p>
        <p>Thank you for your prompt attention to this matter.</p>
        <p>Regards,</p>
      `
    },
    'assertive': {
      subject: 'Urgent: Invoice #{invoice_number} Significantly Overdue',
      body: `
        <p>Hello {client_name},</p>
        <p>Invoice #{invoice_number} for {invoice_amount} is now {days_overdue} days past the due date of {due_date}.</p>
        <p>This requires your immediate attention. Please arrange payment now.</p>
        <p>If there are issues preventing payment, contact me immediately to discuss.</p>
        <p>Regards,</p>
      `
    },
    'final': {
      subject: 'FINAL NOTICE: Invoice #{invoice_number}',
      body: `
        <p>Hello {client_name},</p>
        <p>This is a final notice regarding invoice #{invoice_number} for {invoice_amount}, which was due on {due_date} and is now {days_overdue} days overdue.</p>
        <p>Immediate payment is required. If payment is not received within 3 business days, further action may be necessary.</p>
        <p>Please contact me immediately regarding payment.</p>
        <p>Regards,</p>
      `
    }
  },

  firm: {
    'pre-due': {
      subject: 'Payment Due Notice: Invoice #{invoice_number}',
      body: `
        <p>Dear {client_name},</p>
        <p>This is a notice that payment for invoice #{invoice_number} in the amount of {invoice_amount} is due on {due_date}.</p>
        <p>Please ensure timely payment to maintain good standing.</p>
        <p>Thank you for your business.</p>
        <p>Sincerely,</p>
      `
    },
    'due': {
      subject: 'Payment Due Today: Invoice #{invoice_number}',
      body: `
        <p>Dear {client_name},</p>
        <p>Payment for invoice #{invoice_number} in the amount of {invoice_amount} is due today.</p>
        <p>Please process this payment today to avoid late fees and keep your account in good standing.</p>
        <p>Thank you for your prompt attention.</p>
        <p>Sincerely,</p>
      `
    },
    'gentle': {
      subject: 'Overdue Payment Notice: Invoice #{invoice_number}',
      body: `
        <p>Dear {client_name},</p>
        <p>Our records indicate that payment for invoice #{invoice_number} in the amount of {invoice_amount} was due on {due_date} and is now {days_overdue} days overdue.</p>
        <p>Please remit payment immediately to bring your account back to current status.</p>
        <p>If you have questions about this invoice, please contact me promptly.</p>
        <p>Sincerely,</p>
      `
    },
    'firm': {
      subject: 'OVERDUE: Invoice #{invoice_number} Requires Immediate Attention',
      body: `
        <p>Dear {client_name},</p>
        <p>Invoice #{invoice_number} for {invoice_amount} is now {days_overdue} days past due. This matter requires your immediate attention.</p>
        <p>Please remit payment in full within 2 business days.</p>
        <p>If there are circumstances preventing timely payment, you must contact me immediately to discuss payment arrangements.</p>
        <p>Sincerely,</p>
      `
    },
    'assertive': {
      subject: 'URGENT: Seriously Overdue Invoice #{invoice_number}',
      body: `
        <p>Dear {client_name},</p>
        <p>Invoice #{invoice_number} for {invoice_amount} is now {days_overdue} days past due. This situation is unacceptable and requires immediate resolution.</p>
        <p>Full payment must be received within 24 hours.</p>
        <p>Failure to address this overdue payment immediately will result in further action being taken.</p>
        <p>Contact me immediately regarding your payment intentions.</p>
        <p>Sincerely,</p>
      `
    },
    'final': {
      subject: 'FINAL NOTICE BEFORE ACTION: Invoice #{invoice_number}',
      body: `
        <p>Dear {client_name},</p>
        <p>Despite multiple notices, invoice #{invoice_number} for {invoice_amount} remains unpaid, {days_overdue} days after the due date.</p>
        <p>This is your final opportunity to remit payment before additional collection measures are implemented.</p>
        <p>You have 48 hours to make full payment or contact me to make payment arrangements.</p>
        <p>Sincerely,</p>
      `
    }
  },

  formal: {
    'pre-due': {
      subject: 'Upcoming Payment Notice: Invoice #{invoice_number}',
      body: `
        <p>Dear {client_name},</p>
        <p>This notice serves as a reminder that payment for Invoice #{invoice_number} in the amount of {invoice_amount} is scheduled to be due on {due_date}.</p>
        <p>Kindly arrange for payment by the due date to ensure timely processing.</p>
        <p>Thank you for your attention to this matter.</p>
        <p>Yours sincerely,</p>
      `
    },
    'due': {
      subject: 'Payment Due Notice: Invoice #{invoice_number}',
      body: `
        <p>Dear {client_name},</p>
        <p>Please be advised that payment for Invoice #{invoice_number} in the amount of {invoice_amount} is due today, {due_date}.</p>
        <p>Your prompt attention to this matter would be greatly appreciated.</p>
        <p>Should you have any questions regarding this invoice, please do not hesitate to contact us.</p>
        <p>Yours sincerely,</p>
      `
    },
    'gentle': {
      subject: 'Payment Overdue Notice: Invoice #{invoice_number}',
      body: `
        <p>Dear {client_name},</p>
        <p>According to our records, payment for Invoice #{invoice_number} in the amount of {invoice_amount} was due on {due_date} and remains outstanding for {days_overdue} days.</p>
        <p>We kindly request that you remit payment at your earliest convenience.</p>
        <p>If you have already processed this payment, please provide the payment details for our records.</p>
        <p>Yours sincerely,</p>
      `
    },
    'firm': {
      subject: 'Formal Notice of Overdue Payment: Invoice #{invoice_number}',
      body: `
        <p>Dear {client_name},</p>
        <p>This letter serves as a formal notice that Invoice #{invoice_number} in the amount of {invoice_amount}, which was due for payment on {due_date}, remains outstanding for {days_overdue} days.</p>
        <p>We hereby request immediate payment of the full amount to rectify this situation.</p>
        <p>Should there be any circumstances preventing timely payment, please contact us immediately to discuss payment arrangements.</p>
        <p>Yours sincerely,</p>
      `
    },
    'assertive': {
      subject: 'Formal Demand for Payment: Invoice #{invoice_number}',
      body: `
        <p>Dear {client_name},</p>
        <p>Despite previous communications, Invoice #{invoice_number} in the amount of {invoice_amount} remains unpaid {days_overdue} days after the due date of {due_date}.</p>
        <p>We hereby formally demand payment in full within 3 business days from the date of this notice.</p>
        <p>Failure to remit payment may result in the implementation of formal collection procedures.</p>
        <p>You are strongly advised to contact us immediately regarding this matter.</p>
        <p>Yours sincerely,</p>
      `
    },
    'final': {
      subject: 'Final Demand for Payment: Invoice #{invoice_number}',
      body: `
        <p>Dear {client_name},</p>
        <p>This letter constitutes our final demand for payment of Invoice #{invoice_number} in the amount of {invoice_amount}, which has remained unpaid for {days_overdue} days since its due date of {due_date}.</p>
        <p>You are hereby given final notice that if full payment is not received within 48 hours, we will have no alternative but to pursue all available legal remedies to recover the debt.</p>
        <p>This may include, but is not limited to, initiating formal collection proceedings and reporting the unpaid debt to relevant credit agencies.</p>
        <p>Yours sincerely,</p>
      `
    }
  }
};

/**
 * Build a template object for storing in the database
 */
export function buildTemplate(
  userId: string | null,
  name: string,
  level: ReminderLevel,
  style: ReminderStyle,
  subject: string,
  body: string,
  isDefault = false
): Omit<ReminderTemplate, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    userId,
    name,
    level,
    style,
    subject,
    body,
    isDefault,
  };
}

/**
 * Create all default templates for seeding the database
 */
export function createDefaultTemplates(): Omit<ReminderTemplate, 'id' | 'createdAt' | 'updatedAt'>[] {
  const templates: Omit<ReminderTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  // Loop through all styles and levels
  for (const [style, levels] of Object.entries(DEFAULT_TEMPLATES)) {
    for (const [level, content] of Object.entries(levels)) {
      const name = `Default ${style} ${level} template`;
      templates.push(
        buildTemplate(
          null, // System templates have null userId
          name,
          level as ReminderLevel,
          style as ReminderStyle,
          content.subject,
          content.body,
          true // Mark as default
        )
      );
    }
  }

  return templates;
} 