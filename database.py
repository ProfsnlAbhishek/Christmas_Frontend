import csv
import mariadb
import sys

# ============================================================
# MariaDB DATABASE CONFIGURATION
# ============================================================

DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "python",
    "password": "python",
    "database": "christmas"
}

# ============================================================
# CSV FILE
# ============================================================

CSV_FILE = "C:/Users/51166839/OneDrive - State of Ohio/Documents/donors.csv"


# ============================================================
# TABLE INFORMATION
# ============================================================

TABLE_NAME = "donors"

COLUMNS = [
    "donorID",
    "donor_name",
    "address1",
    "address2",
    "city",
    "state",
    "zip",
    "pick_date",
    "pick_assigned_to",
    "pick_det",
    "kids_tag",
    "age0_11",
    "age12abv",
    "gift_tag",
    "inf_boy",
    "inf_girl",
    "tod_boy",
    "tod_girl",
    "age6_10b",
    "age6_10g",
    "age11_14b",
    "age11_14g",
    "age15_18b",
    "age15_18g",
    "toy_dr",
    "instruction",
    "active"
]


# ============================================================
# CREATE INSERT STATEMENT
# ============================================================

column_list = ", ".join(
    f"`{column}`" for column in COLUMNS
)

placeholders = ", ".join(
    ["?"] * len(COLUMNS)
)

INSERT_SQL = f"""
    INSERT INTO `christmas`.`{TABLE_NAME}`
    ({column_list})
    VALUES ({placeholders})
"""


# ============================================================
# MAIN IMPORT FUNCTION
# ============================================================

def import_donors():

    conn = None
    cursor = None

    try:

        # ----------------------------------------------------
        # CONNECT TO MARIADB
        # ----------------------------------------------------

        print("Connecting to MariaDB...")

        conn = mariadb.connect(
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=DB_CONFIG["database"]
        )

        print("Connected to MariaDB successfully.")
        print()

        cursor = conn.cursor()

        # ----------------------------------------------------
        # OPEN CSV FILE
        # ----------------------------------------------------

        print(f"Reading file:")
        print(CSV_FILE)
        print()

        inserted = 0
        skipped = 0

        with open(
            CSV_FILE,
            "r",
            encoding="utf-8-sig",
            newline=""
        ) as file:

            reader = csv.reader(file)

            # ------------------------------------------------
            # PROCESS EACH ROW
            # ------------------------------------------------

            for line_number, row in enumerate(reader, start=1):

                # Skip completely blank lines
                if not row:
                    continue

                # ------------------------------------------------
                # CHECK COLUMN COUNT
                # ------------------------------------------------

                if len(row) != len(COLUMNS):

                    print(
                        f"ERROR on line {line_number}: "
                        f"Expected {len(COLUMNS)} columns, "
                        f"but found {len(row)}"
                    )

                    print("Row:")
                    print(row)
                    print()

                    skipped += 1
                    continue

                # ------------------------------------------------
                # CLEAN VALUES
                #
                # IMPORTANT:
                # Empty values remain EMPTY STRINGS.
                #
                # Example:
                #
                #     John,,123 Main St
                #
                # becomes:
                #
                #     "John", "", "123 Main St"
                #
                # NOT NULL.
                # ------------------------------------------------

                values = [
                    value.strip()
                    for value in row
                ]

                # ------------------------------------------------
                # INSERT RECORD
                # ------------------------------------------------

                try:

                    cursor.execute(
                        INSERT_SQL,
                        values
                    )

                    inserted += 1

                    print(
                        f"Inserted line {line_number}: "
                        f"donorID={values[0]}"
                    )

                except mariadb.Error as e:

                    print(
                        f"ERROR inserting line "
                        f"{line_number}: {e}"
                    )

                    print("Row:")
                    print(row)
                    print()

                    skipped += 1

        # ----------------------------------------------------
        # COMMIT
        # ----------------------------------------------------

        conn.commit()

        # ----------------------------------------------------
        # RESULTS
        # ----------------------------------------------------

        print()
        print("=" * 60)
        print("IMPORT COMPLETE")
        print("=" * 60)
        print(f"Records inserted : {inserted}")
        print(f"Records skipped  : {skipped}")
        print("=" * 60)

    except FileNotFoundError:

        print()
        print("ERROR: CSV file was not found.")
        print()
        print("Expected file:")
        print(CSV_FILE)

        sys.exit(1)

    except mariadb.Error as e:

        print()
        print("DATABASE ERROR:")
        print(e)

        if conn:
            conn.rollback()

        sys.exit(1)

    except Exception as e:

        print()
        print("UNEXPECTED ERROR:")
        print(e)

        if conn:
            conn.rollback()

        sys.exit(1)

    finally:

        # ----------------------------------------------------
        # CLOSE DATABASE CONNECTION
        # ----------------------------------------------------

        if cursor:
            cursor.close()

        if conn:
            conn.close()

        print()
        print("Database connection closed.")


# ============================================================
# RUN PROGRAM
# ============================================================

if __name__ == "__main__":
    import_donors()
