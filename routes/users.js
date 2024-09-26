var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const db = require('../models');
const UserService = require('../services/UserService');
const userService = new UserService(db);
const jwt = require('jsonwebtoken');
/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.post('/', async function (req, res, next) {
	const { firstname, lastname, username, password } = req.body;
	try {
		let salt = crypto.randomBytes(16);
		crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {

			let result = userService.create(firstname, lastname, username, salt, hashedPassword).then(token => {
				token = encodeJWT(result.dataValues.id, result.dataValues.Username, res);
				res.status(200).json({ message: 'User created successfully', data: { token: token } })
			}).catch(err => {
				if (err.name === 'SequelizeUniqueConstraintError')
					return res.status(409).json({ error: 'Username already exists' });
			})
		})

	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
})

router.post('/login', async function (req, res, next) {
	const { username, password } = req.body;
	userService.getOne(username).then((user) => {
		if (user == null) return res.json({ message: 'User does not exist or password is incorrect' });

		crypto.pbkdf2(password, user.dataValues.Salt, 310000, 32, 'sha256', function (err, hashedPassword) {
			if (!crypto.timingSafeEqual(user.dataValues.EncryptedPassword, hashedPassword))
				return res.status(401).send({ result: 'Incorrect username or password' });

			try {
				let token = jwt.sign({ id: user.dataValues.id, username: user.dataValues.Username }, process.env.TOKEN_SECRET, { expiresIn: '2h' })
				return res.status(200).json({ message: 'Successfully logged in', username: user.dataValues.Username, token: token })
			} catch (error) {
				return res.status(400).json({ message: 'Error occurred while trying to sign jwt' });
			}
		})
	})

})

function encodeJWT(id, username, res) {
	try {
		let token = jwt.sign({ id: id, username: username }, process.env.TOKEN_SECRET, { expiresIn: '2hr' });
		return token;
	} catch (error) {
		return res.jsend.error({
			statusCode: 400,
			result: 'Something went wrong when creating JWT token'
		})
	}
}

module.exports = router;