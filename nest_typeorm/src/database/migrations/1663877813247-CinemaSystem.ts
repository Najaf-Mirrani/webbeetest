import { MigrationInterface, QueryRunner } from 'typeorm';

export class CinemaSystem1663877813247 implements MigrationInterface {
  /**
   # ToDo: Create a migration that creates all tables for the following user stories

   For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
   To not introduce additional complexity, please consider only one cinema.

   Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

   ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times
   * As a user I want to only see the shows which are not booked out

   **Show administration**
   * As a cinema owner I want to run different films at different times
   * As a cinema owner I want to run multiple films at the same time in different showrooms

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I dont want to configure the seating for every show
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE movie (
        id INT NOT NULL AUTOINCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255)
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE cinema (
        id INT NOT NULL AUTOINCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE show (
        id INT NOT NULL AUTOINCREMENT PRIMARY KEY,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        movie_id INT NOT NULL,
        cinema_id INT NOT NULL,
        FOREIGN KEY (movie_id) REFERENCES movie (id),
        FOREIGN KEY (cinema_id) REFERENCES cinema (id)
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE show_room (
        id INT NOT NULL AUTOINCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cinema_id INT NOT NULL,
        FOREIGN KEY (cinema_id) REFERENCES cinema (id)
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE pricing (
        id INT NOT NULL AUTOINCREMENT PRIMARY KEY,
        show_id INT NOT NULL,
        seat_type VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (show_id) REFERENCES show (id)
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE seat (
        id INT NOT NULL AUTOINCREMENT PRIMARY KEY,
        show_room_id INT NOT NULL,
        seat_number INT NOT NULL,
        seat_type VARCHAR(255) NOT NULL,
        is_booked BOOLEAN NOT NULL DEFAULT FALSE,
        FOREIGN KEY (show_room_id) REFERENCES show_room (id)
      )`,
    );

    await queryRunner.query(
      ` CREATE TABLE "booking" (
                "id" SERIAL NOT NULL PRIMARY KEY,
                "showId" integer NOT NULL,
                "seatId" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                FOREIGN KEY ("showId") REFERENCES "show" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY ("seatId") REFERENCES "seat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
            )`,
    );

    // throw new Error('TODO: implement migration in task 4');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "booking"
        `);

    await queryRunner.query(`
            DROP TABLE "seat"
        `);

    await queryRunner.query(`
            DROP TABLE "show"
        `);

    await queryRunner.query(`
            DROP TABLE "movie"
        `);

    await queryRunner.query(`
            DROP TABLE "cinema"
        `);
  }
}
