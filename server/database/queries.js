const database = require('./databaseConnection');

async function createUser(postData) {
	let createUserSQL = `
		INSERT INTO user
		(username, email, hashed_password)
		VALUES
		(:user, :email, :passwordHash);
	`;
	// Default user_type to 1 and profile_pic to null?
	let params = {
		user: postData.username,
		email: postData.email,
		passwordHash: postData.hashedPassword,
		user_type_id: 1,
		profile_pic_id: null,
	}
	
	try {
		await database.query(createUserSQL, params);

		return true;
	}
	catch(err) {
		console.log("Error inserting user");
        console.log(err);
		return false;
	}
}

async function getUser(postData) {
	let getUserSQL = `
		SELECT user_id, username, hashed_password, user_type_id
		FROM user
		JOIN user_type USING(user_type_id)
		WHERE username = :user;
	`;

	let params = {
		user: postData.user
	}
	
	try {
		const results = await database.query(getUserSQL, params);

		return results[0];
	}
	catch(err) {
		console.log("Error trying to find user");
        console.log(err);
		return false;
	}
}

module.exports = {createUser, getUser};