CREATE DATABASE IF NOT EXISTS `foobar`;
use foobar;

CREATE TABLE IF NOT EXISTS `user` (
    `id` INT(9) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `full_name` VARCHAR(100),
    `email` VARCHAR(254) NOT NULL,
    `hashed_password` BINARY(60) NOT NULL,
    `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT `user_account_unq` UNIQUE (`email`)
)Engine=InnoDB DEFAULT CHARSET=utf8mb4;
