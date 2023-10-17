const database = include('databaseConnection');

async function createTables() {

    let createUserTypeSQL = `
    CREATE TABLE user_type (
        user_type_id INT NOT NULL AUTO_INCREMENT,
        type VARCHAR(20) NOT NULL,
        PRIMARY KEY (user_type_id));
      `

    // TODO: UPDATE TO USE user_type_id AS WELL
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

    let insertSystemSQL = `
    INSERT INTO systemvariables (keyname, thevalue) VALUES (nextContentId, 1234);
    `
    
    try {
        const resultUserType = await database.query(createUserTypeSQL);
        const resultsUsers = await database.query(createUsersSQL);


        console.log("Successfully created user type table");
        console.log(resultUserType[0]);

        console.log("Successfully created cuser table");
        console.log(resultsUsers[0]);

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