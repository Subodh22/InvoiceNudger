# InvoiceNudger

InvoiceNudger is an automated solution for freelancers to send professional payment reminders and get paid faster without the awkward conversations.

## Features

- Automated, escalating reminder sequences
- Professional email templates
- Client and invoice management
- Customizable reminder schedules

## Tech Stack

- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS
- Firebase Authentication & Firestore
- Resend Email API

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- A Resend API key
- A Firebase project

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Subodh22/InvoiceNudger.git
   cd InvoiceNudger
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.example`
   ```bash
   cp .env.example .env.local
   ```

4. Update the `.env.local` file with your credentials

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Email Configuration

The application uses Resend for sending emails. To use this feature:

1. Sign up for a Resend account at [resend.com](https://resend.com)
2. Add your domain and verify it or use Resend's test domain
3. Add your Resend API key to the `.env.local` file

## Deployment

The easiest way to deploy this application is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSubodh22%2FInvoiceNudger)

## License

MIT#   I n v o i c e N u d g e r 
 
 