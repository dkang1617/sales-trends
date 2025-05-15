import psycopg2
import psycopg2.extras
import datetime
import configparser
import sys

config = configparser.ConfigParser()
config.read("config.ini")

connection = None
cursor = None

try:
    connection = psycopg2.connect(
        host = config["database"]["host"],
        dbname = config["database"]["dbname"],
        user = config["database"]["user"],
        password = config["database"]["password"],
        port = config["database"]["port"]
    )

    cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)
    salesQuery = """
SELECT theater_id, SUM(sales) AS sales_total
FROM sales
WHERE date = %s
GROUP BY theater_id
ORDER BY sales_total DESC
LIMIT 1;
"""
    try:
        selectedDate = input("Enter a date in YYYY-MM-DD format: ")
        datetime.date.fromisoformat(selectedDate)
    except Exception as inputError:
        raise Exception("Invalid date.")
    
    cursor.execute(salesQuery, (selectedDate,))
    salesResult = cursor.fetchone()
    if salesResult:
        winningTheaterId = salesResult["theater_id"]
        winningTheaterSales = salesResult["sales_total"]
    else:
        print("There are no datapoints for the given date.")
        sys.exit()
    
    theaterQuery = """
SELECT theater_name
FROM theaters
WHERE theater_id = %s
"""
    cursor.execute(theaterQuery, (winningTheaterId,))
    theaterResult = cursor.fetchone()
    print(f"The best selling theater on {selectedDate} is {theaterResult["theater_name"]} with a revenue of ${winningTheaterSales}.")

    connection.commit()
except Exception as connError:
    print(connError)
finally:
    if connection is not None:
        connection.close()
    if cursor is not None:
        cursor.close()
