const database = include('databaseConnection');

async function createTables() {

    let createUserTypeSQL = `
    CREATE TABLE user_type (
        user_type_id INT NOT NULL AUTO_INCREMENT,
        type VARCHAR(20) NOT NULL,
        PRIMARY KEY (user_type_id));
      `

    let createUsersSQL = `
    CREATE TABLE user (
        user_id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(45) NOT NULL,
        hashed_password VARCHAR(100) NOT NULL,
        email VARCHAR(50) NOT NULL,
        profile_pic_id VARCHAR(45) NULL,
        user_type_id INT NOT NULL DEFAULT 1,
        PRIMARY KEY (user_id),
        INDEX user_user_type_id_idx (user_type_id ASC) VISIBLE,
        CONSTRAINT user_user_type_id
          FOREIGN KEY (user_type_id)
          REFERENCES user_type (user_type_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION);
    `;

    let createPostSQL = `
    CREATE TABLE post (
        post_id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(45) NOT NULL,
        content TEXT NOT NULL,
        url VARCHAR(30) NOT NULL,
        post_datetime DATE NOT NULL,
        like_count INT NOT NULL DEFAULT 0,
        dislike_count INT NOT NULL DEFAULT 0,
        user_id INT NOT NULL,
        PRIMARY KEY (post_id),
        INDEX post_user_id_idx (user_id ASC) VISIBLE,
        CONSTRAINT post_user_id
          FOREIGN KEY (user_id)
          REFERENCES user (user_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION);
    `;

    let createClosureSQL = `
    CREATE TABLE closure_comment (
        closure_comment_id INT NOT NULL AUTO_INCREMENT,
        parent_comment_id INT NULL,
        child_comment_id INT NULL,
        depth INT NOT NULL DEFAULT 0,
        PRIMARY KEY (closure_comment_id),
        INDEX child_comment_comment_id_idx (child_comment_id ASC) VISIBLE,
        INDEX parent_comment_comment_id_idx (parent_comment_id ASC) VISIBLE,
        CONSTRAINT child_comment_comment_id
          FOREIGN KEY (child_comment_id)
          REFERENCES comments (comment_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT parent_comment_comment_id
          FOREIGN KEY (parent_comment_id)
          REFERENCES comments (comment_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION);
    `;

    let createCommentSQL = `
    CREATE TABLE comments (
        comment_id INT NOT NULL AUTO_INCREMENT,
        content TEXT NOT NULL,
        comment_datetime DATETIME NOT NULL,
        like_count INT NOT NULL,
        dislike_count INT NOT NULL,
        user_id INT NOT NULL,
        post_id INT NOT NULL,
        PRIMARY KEY (comment_id),
        INDEX comment_post_id_idx (post_id ASC) VISIBLE,
        INDEX comment_user_id_idx (user_id ASC) VISIBLE,
        CONSTRAINT comment_post_id
          FOREIGN KEY (post_id)
          REFERENCES post (post_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT comment_user_id
          FOREIGN KEY (user_id)
          REFERENCES user (user_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION);
      `

      let createPostCommentSQL = `
      CREATE TABLE comment_tree (
        comment_tree_id INT NOT NULL AUTO_INCREMENT,
        comment_id INT NOT NULL,
        parent_comment_id INT NOT NULL,
        PRIMARY KEY (comment_tree_id),
        INDEX comment_tree_comment_id_idx (comment_id ASC) VISIBLE,
        INDEX comment_tree_comment_parent_id_idx (parent_comment_id ASC) VISIBLE,
        CONSTRAINT comment_tree_comment_id
          FOREIGN KEY (comment_id)
          REFERENCES comments (comment_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT comment_tree_comment_parent_id
          FOREIGN KEY (parent_comment_id)
          REFERENCES comments (comment_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION);
      `

    let insertSystemSQL = `
    INSERT INTO systemvariables (keyname, thevalue) VALUES (nextContentId, 1234);
    `
    
    try {
        const resultUserType = await database.query(createUserTypeSQL);
        const resultsUsers = await database.query(createUsersSQL);
        const resultPost = await database.query(createPostSQL);
        const resultClosure = await database.query(createClosureSQL);


        console.log("Successfully created user type table");
        console.log(resultUserType[0]);

        console.log("Successfully created user table");
        console.log(resultsUsers[0]);

        console.log("Successfully created post table");
        console.log(resultPost[0]);

        console.log("Successfully created closure table");
        console.log(resultClosure[0]);

        return true;
    }
    catch(err) {
        console.log("Error Creating tables");
        console.log(err);
        return false;
    }
}

/* 
Stored functions
  delimiter $$
  drop function if exists `initials`$$
  CREATE FUNCTION `initials`(str text, expr text) RETURNS text CHARSET utf8mb4
  begin
      declare result text default '';
      declare buffer text default '';
      declare i int default 1;
      if(str is null) then
          return null;
      end if;
      set buffer = trim(str);
      while i <= length(buffer) do
          if substr(buffer, i, 1) regexp expr then
              set result = concat( result, substr( buffer, i, 1 ));
              set i = i + 1;
              while i <= length( buffer ) and substr(buffer, i, 1) regexp expr do
                  set i = i + 1;
              end while;
              while i <= length( buffer ) and substr(buffer, i, 1) not regexp expr do
                  set i = i + 1;
              end while;
          else
              set i = i + 1;
          end if;
      end while;
      return result;
  end$$

  drop function if exists `acronym`$$
  CREATE FUNCTION `acronym`(str text) RETURNS text CHARSET utf8mb4
  begin
      declare result text default '';
      set result = initials( str, '[[:alnum:]]' );
      return result;
  end$$
  delimiter ;

  DELIMITER $$
  CREATE FUNCTION GetContentId(title text) RETURNS VARCHAR(20)
  DETERMINISTIC
  BEGIN
  DECLARE contentId varchar(20);
  UPDATE systemvariables
  SET thevalue = @newvalue := thevalue + 1
  WHERE keyname = 'nextContentId';
  SELECT CONCAT(substring(year(now()),3,2), @newvalue, '_', acronym(title))
  into contentId;
  RETURN (contentId);
  END $$
  DELIMITER ;

TRIGGER
    DELIMITER $$
    CREATE TRIGGER insert_post AFTER INSERT ON post
    FOR EACH ROW
    BEGIN
        IF NEW.title IS NOT NULL THEN
            INSERT INTO closure_post (parent_post_id, child_post_id, depth)
            VALUES (NEW.post_id, NEW.post_id, 0);
        ELSEIF NEW.title IS NULL THEN
            INSERT INTO closure_post (parent_post_id, child_post_id, depth)
            SELECT parent_post_id, NEW.post_id
            FROM closure_post
            WHERE parent_post_id = # HOW DO I FIND THE PARENT_ID HERE?
            UNION ALL SELECT NEW.post_id, NEW.post_id;
        END IF;
    END
    DELIMITER ;



DELIMITER $$

    CREATE TRIGGER after_comment_tree_insert
    AFTER INSERT
    ON comment_tree FOR EACH ROW
    BEGIN
        IF NEW.comment_id != NEW.parent_comment_id THEN
            UPDATE comments
            SET reply_count = reply_count + 1
            WHERE comment_id = NEW.parent_comment_id;
        END IF;
    END$$

DELIMITER ;
*/

module.exports = {createTables};