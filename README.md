# sales-trends

This is a project where I created a mock database with three tables, movies, theaters, and sales. There are two programs that both achieve the same end-goal: Find the best-selling theater for a given day.
The Python file utilizes psycopg2 to connect with the PostgreSQL table, and queries it to find the correct answer.

sales_trend_dump.rtf contains a dump of the three tables within the database. These were created using SQL queries in pgAdmin 4.

The queries:

CREATE TABLE THEATERS (
	THEATER_ID INT PRIMARY KEY,
	THEATER_NAME VAR_CHAR(100) NOT NULL
);

CREATE TABLE MOVIES (
	MOVIE_ID INT PRIMARY KEY,
	TITLE VAR_CHAR(100) NOT NULL
);

CREATE TABLE SALES (
	SALES_ID SERIAL PRIMARY KEY,
	THEATER_ID INT NOT NULL,
	MOVIE_ID INT NOT NULL,
	DATE DATE NOT NULL,
	SALES DECIMAL(8, 2) NOT NULL,
	FOREIGN KEY (theater_id) REFERENCES theaters(theater_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

I then used INSERT queries to insert data for each table.

You can see examples of the output for various input for both programs in the result PNG's.

For the optional extension of one of my solutions, I created a very simple web page using Express for the JavaScript solution. You can see it in index.html, app.js, and a screenshot of example output in the WebpageExample.png. For the sake of time, I kept it very light and simplistic, but I chose this webpage to demonstrate that I can and have worked in a full-stack environment. Of course, I could add styling and try to improve on the page, but it was just a small POC to demonstrate that.

Thanks!
