const database = include('databaseConnection');

async function createUser(postData) {
	let createUserSQL = `
		INSERT INTO users
		(username, email, hashed_password, user_type_id, profile_pic_id)
		VALUES
		(:user, :email, :passwordHash, :user_type_id, :profile_pic_id);
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
		FROM users
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

// Call this on page load only => Store local version of this and filter for search bar, and reload on page refresh
async function getContent() {
	let getContentSQL = `
		SELECT *
		FROM content
		JOIN users USING (user_id)
		ORDER BY create_date DESC;
	`;

	try {
		const results = await database.query(getContentSQL);

		return results[0];
	}
	catch(err) {
		console.log("Error trying to find content");
        console.log(err);
		return false;
	}
}

async function getContentWithUrl(postData) {
	let getContentWithUrlSQL = `
		SELECT *
		FROM content
		JOIN users USING (user_id)
		WHERE url = :url;
	`;

	let params = {
		url: postData.url
	}

	try {
		const results = await database.query(getContentWithUrlSQL, params);

		return results[0];
	}
	catch(err) {
		console.log("Error trying to find content");
        console.log(err);
		return false;
	}
}

async function increaseHitCount(postData) {
	let updateHitCountSQL = `
	UPDATE content 
	SET hit_count = :newCount 
	WHERE (content_id = :content_id);
`;

let params = {
	content_id: postData.content_id,
	newCount: postData.hitCount
}

try {
	await database.query(updateHitCountSQL, params);
}
catch(err) {
	console.log("Error trying to update hit count");
	console.log(err);
	return false;
}
}

async function postContent(postData) {
	let getUserSQL = `
	INSERT INTO content
	(user_id, url, is_active, content_type_id, content_data, content_title, create_date, last_hit_date, hit_count)
	VALUES
	(:user_id, GetContentId(:content_title), :is_active, :content_type_id, :content_data, :content_title, :create_date, :last_hit_date, :hit_count);
`;

const currentDate = new Date();
// content -> 1 = image, 2 = text, 3 = url
let params = {
	user_id: postData.user_id,
	is_active: true,
	content_type_id: postData.content_type,
	content_title: postData.title,
	content_data: postData.content_data,
	create_date: currentDate,
	last_hit_date: currentDate,
	hit_count: 0,

}

try {
	await database.query(getUserSQL, params);

	return true;
}
catch(err) {
	console.log("Error trying to post content");
	console.log(err);
	return false;
}
}



module.exports = {createUser, getUser, getContent, postContent, getContentWithUrl, increaseHitCount};