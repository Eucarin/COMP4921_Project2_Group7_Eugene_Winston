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

async function createPost(postData) {
	let createPostSQL = `
		INSERT INTO post
		(title, content, post_datetime, user_id, url)
		VALUES
		(:title, :content, :post_datetime, :user_id, GetContentId(:title));
	`;
	// Default user_type to 1 and profile_pic to null?
	let params = {
		title: postData.title,
		content: postData.content,
		post_datetime: new Date(),
		user_id: postData.user_id,
	}

	// let insertClosureSQL = `
	// INSERT INTO closure_post (parent_post_id, child_post_id, depth)
    // VALUES (:post_id, :post_id, 0);
	// `
	
	try {
		const result = await database.query(createPostSQL, params);

		// let paramsTwo = {
		// 	post_id: result[0].insertId
		// }

		// await database.query(insertClosureSQL, paramsTwo);

		return true;
	}
	catch(err) {
		console.log("Error inserting post");
        console.log(err);
		return false;
	}
}

async function createComment(postData) {
	let createPostSQL = `
		INSERT INTO comments
		(content, comment_datetime, user_id, post_id)
		VALUES
		(:content, :comment_datetime, :user_id, :post_id);
	`;
	// Default user_type to 1 and profile_pic to null
	let params = {
		content: postData.content,
		comment_datetime: new Date(),
		user_id: postData.user_id,
		post_id: postData.post_id
	}

	let insertCommentTreeSQL = `
	INSERT INTO comment_tree (comment_id, parent_comment_id)
    VALUES (:comment_id, :parent_comment_id);
	`
	
	try {
		const result = await database.query(createPostSQL, params);
		let paramsTwo = {
			comment_id: result[0].insertId,
			// parent_comment_id: postData.parent_comment_id
		}


		if(postData.parent_comment_id) {
			paramsTwo.parent_comment_id = postData.parent_comment_id
		} else {
			// If not a reply to a comment, its parent will be itself.
			paramsTwo.parent_comment_id = result[0].insertId;
		}

		await database.query(insertCommentTreeSQL, paramsTwo);

		return true;
	}
	catch(err) {
		console.log("Error inserting comment");
        console.log(err);
		return false;
	}
}

async function getPostWithURL(postData) {
	let getPostSQL = `
		SELECT post_id, title, content, post_datetime, like_count, dislike_count, user_id, username
		FROM post
		JOIN user USING (user_id)
		WHERE url = :url;
	`;

	let params = {
		url: postData.url,
	}

	try {
		const results = await database.query(getPostSQL, params);
		return results[0][0];
	}
	catch(err) {
		console.log("Error trying to get post data");
        console.log(err);
		return false;
	}
}

async function getAllPost() {
	let getAllPostSQL = `
		SELECT *
		FROM post;
	`;

	try {
		const results = await database.query(getAllPostSQL);

		return results[0];
	}
	catch(err) {
		console.log("Error trying to get all posts");
        console.log(err);
		return false;
	}
}

async function getAllComments(postData) {
	let getAllCommentsSQL = `
		SELECT comment_datetime, content, dislike_count, like_count, post_id, username, comment_id, reply_count
		FROM comment_tree
		JOIN comments USING (comment_id)
		JOIN user USING (user_id)
		WHERE post_id = :post_id
		AND comment_id = parent_comment_id;
	`;

	let params = {
		post_id: postData.post_id,
	}

	try {
		const results = await database.query(getAllCommentsSQL, params);
		return results[0];
	}
	catch(err) {
		console.log("Error trying to get all comments");
        console.log(err);
		return false;
	}
}

async function getRecursiveReplies(postData) {
	let getRecursiveRepliesSQL = `
	WITH RECURSIVE
		connections AS (
			SELECT comment_id, parent_comment_id,
			parent_comment_id AS final_dest,
			1 AS depth, JSON_ARRAY(comment_id, parent_comment_id) AS destinations
			FROM comment_tree
			UNION
			SELECT connections.comment_id, connections.parent_comment_id,
			comment_tree.parent_comment_id,
			depth + 1,
			JSON_ARRAY_APPEND(connections.destinations, "$", comment_tree.parent_comment_id)
			FROM connections
			JOIN comment_tree on connections.final_dest = comment_tree.comment_id
			AND NOT JSON_CONTAINS(connections.destinations,
			JSON_ARRAY(comment_tree.parent_comment_id)) 
		)
	SELECT post_id, user_id, comment_id, parent_comment_id, final_dest, depth, destinations, content, comment_datetime, like_count, dislike_count, username, profile_pic_id
	FROM connections
	JOIN comments USING (comment_id)
	JOIN user USING (user_id)
	WHERE comment_id != parent_comment_id
	AND post_id = :post_id
	AND final_dest = :final_dest
	ORDER BY depth DESC;
	`;

	let params = {
		post_id: postData.post_id,
		final_dest: postData.final_dest
	}

	try {
		const results = await database.query(getRecursiveRepliesSQL, params);
		return results[0];
	}
	catch(err) {
		console.log("Error trying to get all replies");
        console.log(err);
		return false;
	}
}

async function getComment(postData) {
	let getCommentSQL = `
		SELECT comment_datetime, content, dislike_count, like_count, post_id, username, comment_id, reply_count
		FROM comment_tree
		JOIN comments USING (comment_id)
		JOIN user USING (user_id)
		WHERE comment_id = :comment_id;
	`;

	let params = {
		comment_id: postData.comment_id,
	}

	try {
		const results = await database.query(getCommentSQL, params);
		return results[0][0];
	}
	catch(err) {
		console.log("Error trying to get comment");
        console.log(err);
		return false;
	}
}


module.exports = {createUser, getUser, createPost, getAllPost, getPostWithURL, createComment, getAllComments, getRecursiveReplies, getComment};