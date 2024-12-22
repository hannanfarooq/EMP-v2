const nodemailer = require('nodemailer')
//lxnh jkhe ojbk eomu

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		// type: 'OAuth2',
		// user: 'hannanfarooq8195@gmail.com',
		// pass: 'biri hdke eljf pqkj',
		user: 'moremeapp@gmail.com',
		pass: 'itip txxd ptar dqeb',
		// clientId: process.env.OAUTH_CLIENTID,
		// clientSecret: process.env.OAUTH_CLIENT_SECRET,
		// refreshToken: process.env.OAUTH_REFRESH_TOKEN
	}
});


export const sendEMail = (sender_email, receiver_email, email_subject, email_body) => {
	const data = {
		"from": sender_email,
		"to": receiver_email,
		"subject": email_subject,
		"text": email_body
	};

	transporter.sendMail(data, (error, info) => {
		if (error) {
			console.log('Error sending email:', error);
		} else {
			console.log('Email sent:', data ,info.response);
		}
	})
}