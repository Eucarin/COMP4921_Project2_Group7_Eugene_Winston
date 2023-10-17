const database = include('databaseConnection');

async function createTables() {

    let createUserTypeSQL = `
    CREATE TABLE IF NOT EXISTS user_type (
      user_type_id INT NOT NULL AUTO_INCREMENT,
      type VARCHAR(45) NOT NULL,
      PRIMARY KEY (user_type_id));
      `

    // TODO: UPDATE TO USE user_type_id AS WELL
    let createUsersSQL = `
    CREATE TABLE IF NOT EXISTS users (
        user_id INT NOT NULL AUTO_INCREMENT,
        user_type_id INT NOT NULL,
        username VARCHAR(45) NOT NULL,
        hashed_password VARCHAR(45) NOT NULL,
        email VARCHAR(45) NOT NULL,
        profile_pic_id VARCHAR(45) NULL,
        PRIMARY KEY (user_id),
        UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE,
        CONSTRAINT user_user_type
          FOREIGN KEY (user_type_id)
          REFERENCES user_type (user_type_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION);
    `;

    let createContentTypeSQL = `
    CREATE TABLE IF NOT EXISTS  content_type (
        content_type_id INT NOT NULL AUTO_INCREMENT,
        type VARCHAR(45) NOT NULL,
        PRIMARY KEY (content_type_id));
    `

    let createContentSQL = `
    CREATE TABLE IF NOT EXISTS  content (
        content_id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        url VARCHAR(45) NOT NULL,
        is_active TINYINT NOT NULL,
        content_type_id INT NOT NULL,
        content_title VARCHAR(45) NOT NULL,
        content_data LONGTEXT NOT NULL,
        create_date DATE NOT NULL,
        last_hit_date DATE NULL,
        hit_count INT NOT NULL,
        PRIMARY KEY (content_id),
        UNIQUE INDEX url_UNIQUE (url ASC) VISIBLE,
        INDEX user_id_idx (user_id ASC) VISIBLE,
        INDEX content_type_id_idx (content_type_id ASC) VISIBLE,
        CONSTRAINT content_users
          FOREIGN KEY (user_id)
          REFERENCES users (user_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT content_content_type
          FOREIGN KEY (content_type_id)
          REFERENCES content_type (content_type_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION);
    `

    let createCustomUrlSQL = `
    CREATE TABLE IF NOT EXISTS  custom_url (
        custom_url_id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        content_id INT NOT NULL,
        PRIMARY KEY (custom_url_id),
        INDEX custom_url_content_idx (content_id ASC) VISIBLE,
        INDEX custom_url_users_idx (user_id ASC) VISIBLE,
        CONSTRAINT custom_url_content
          FOREIGN KEY (content_id)
          REFERENCES content (content_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT custom_url_users
          FOREIGN KEY (user_id)
          REFERENCES users(user_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION);
    `

    let createSystemVariablesSQL = `
    CREATE TABLE systemvariables (
        keyname VARCHAR(20) NOT NULL,
        value INT NOT NULL,
        PRIMARY KEY (keyname));
        `

    let insertSystemSQL = `
    INSERT INTO systemvariables (keyname, thevalue) VALUES (nextContentId, 1234);
    `
    
    try {
        const resultUserType = await database.query(createUserTypeSQL);
        const resultsUsers = await database.query(createUsersSQL);
        const resultsContentType = await database.query(createContentTypeSQL);
        const resultsContent = await database.query(createContentSQL);
        const resultsCustomUrl = await database.query(createCustomUrlSQL);

        console.log("Successfully created user table");
        console.log(resultsUsers[0]);

        console.log("Successfully created content type table");
        console.log(resultsContentType[0]);

        console.log("Successfully created content table");
        console.log(resultsContent[0]);

        console.log("Successfully created custom url table");
        console.log(resultsCustomUrl[0]);
        return true;
    }
    catch(err) {
        console.log("Error Creating tables");
        console.log(err);
        return false;
    }
}

/* Stored functions
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
*/

module.exports = {createTables};