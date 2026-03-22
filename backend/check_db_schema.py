
import sqlite3

def check_jobs_table():
    conn = sqlite3.connect('resume.db')
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(jobs)")
    columns = cursor.fetchall()
    for col in columns:
        print(col)
    conn.close()

if __name__ == "__main__":
    with open('db_schema_info.txt', 'w') as f:
        import sqlite3
        conn = sqlite3.connect('resume.db')
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(jobs)")
        columns = cursor.fetchall()
        for col in columns:
            f.write(str(col) + '\n')
        conn.close()
