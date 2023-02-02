import nodemailer from 'nodemailer'

class MailService {
    transporter: any
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number( process.env.SMTP_PORT ),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        })
    }
    async sendActivationMail( to: string, link: string ) {
        this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Activation letter from ' + process.env.API_URL,
            text: '',
            html: `
                    <div>
                        <h1>To confirm your email click on the link below</h1>
                        <a href='${ link }'>${ link }</a>
                    </div>
            `
        })
    }
}

export default new MailService()