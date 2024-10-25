let API_KEY = '41d82bbcaedaa2345ca958b41daa5534-ee16bf1a-0cee6162';
let DOMAIN = 'sandbox34c4dd9848a8424eb63ba57fed2f66d8.mailgun.org';
const mailgun = require('mailgun-js')
	({ apiKey: API_KEY, domain: DOMAIN });

export const sendMail = function (sender_email, receiver_email,
	email_subject, email_body) {

	const data = {
		"from": sender_email,
		"to": receiver_email,
		"subject": email_subject,
		"text": email_body
	};

	mailgun.messages().send(data, (error, body) => {
		if (error) console.log(error)
		else console.log(body);
	});
}
