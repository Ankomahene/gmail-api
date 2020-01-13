//Install express server
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const secrets = require('./credentials.json');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/talk-tales-ui'));

// app.use(cors, { origin: '*' });
app.use(bodyParser.json());

// app.get('/*', function(req, res) {
// 	console.log('this is the root page');
// 	res.sendFile(path.join(__dirname + '/dist/talk-tales-ui/index.html'));
// });

const sendMail = (user, callback) => {
	console.log('Service Email: ', secrets.client_email);

	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			type: 'OAuth2',
			user: secrets.client_email,
			serviceClient: secrets.client_id,
			privateKey: secrets.private_key,
			accessToken: secrets.token_uri,
			expires: 1484314697598
		}
	});

	const mailOptions = {
		from: secrets.client_email,
		to: `<${user.email}>`,
		subject: 'Pollster Email Testing',
		html: `<h1>POLL APPLICATION</1>`
	};

	transporter.sendMail(mailOptions, callback);
};

app.get('/test', (req, res) => {
	res.send('Server Testing is running...');
});

// define a sendmail endpoint, which will send emails and response with the corresponding status
app.post('/sendmail', (req, res) => {
	console.log('request came');

	let user = req.body;

	sendMail(user, (err, info) => {
		if (err) {
			console.log(err);
			res.status(400);
			res.send({ error: 'Failed to send email' });
		} else {
			console.log('Email has been sent');
			res.send(info);
		}
	});
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080, () => {
	console.log('The server started...');
});
