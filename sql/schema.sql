CREATE TABLE user (
  id             BIGINT       NOT NULL AUTO_INCREMENT,
  username       varchar(255) NOT NULL,
  password       char(60)     NOT NULL,
  name           char(40)     NOT NULL,
  last_workspace BIGINT           NULL,

  PRIMARY KEY (id),
  UNIQUE (username)
);

CREATE TABLE workspace (
  id              BIGINT       NOT NULL AUTO_INCREMENT,
  creator_user_id BIGINT       NOT NULL,
  name            varchar(255) NOT NULL,

  PRIMARY KEY (id),
  FOREIGN KEY (creator_user_id) REFERENCES user(id)
)
