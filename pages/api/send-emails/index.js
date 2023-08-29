// export const runtime = 'edge';
// export const dynamic = 'force-dynamic';
import { Resend } from 'resend';

const RESEND_API_KEY = `${process.env.RESEND_API_KEY}`;

const resend = new Resend(RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'request error' });
  }

  try {
    const data = await resend.emails.send({
      from: 'datafarm.ng <noreply@datafarm.ng>',
      to: 'kelvintonyph@gmail.com',
      subject: 'hello world - testing!',
      html: '<strong>it working now with the update!</strong>',
    });

    if (!data) {
      console.log(response);
      throw new Error('something went wwrong');
    }

    return res
      .status(200)
      .json({ message: 'message sent successfully!', data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
