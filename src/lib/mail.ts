import { createTransport, TransportOptions } from 'nodemailer'

const transporter = createTransport({
  host: 'smtp.jcb.local',
  port: '25',
  tls: {
    rejectUnauthorized: false,
  },
} as TransportOptions)

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyLink = `${process.env.BASE_URL}/verify-email?token=${token}`

  const body = `
  <h1>Verify your email address</h1>
  <p>Click the link below to verify your email address</p>
  <a href="${verifyLink}">Verify email</a>
  `

  try {
    const message = {
      to: email,
      from: 'QualityUptime@jcb.com',
      subject: 'Verify email',
      html: '<img src="cid:jcb-logo"/>' + body,
      attachments: [
        {
          filename: 'QUT.png',
          path: './public/images/email/QUT.png',
          cid: 'jcb-logo',
        },
      ],
    }
    await transporter.sendMail(message)
  } catch (error) {
    console.log(error)
  }
}
