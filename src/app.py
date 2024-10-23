from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import sqlite3

app = Flask(__name__)
CORS(app)  # Enable CORS to allow communication between Flask and React

# Load the CSV file into a pandas DataFrame
file_path = 'D:/FInal_year_project/datasets/med.csv'  # Update this with the actual path
df = pd.read_csv(file_path)

# Connect to an SQLite database (or create one in-memory)
conn = sqlite3.connect(':memory:', check_same_thread=False)  # Allow connections across threads

# Convert the DataFrame to SQL
df.to_sql('hospital_data', conn, if_exists='replace', index=False)

@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_message = request.json.get('message')

    # Example query to fetch all rows where gender is 'Female'
    query = "SELECT * FROM hospital_data "
    result = pd.read_sql(query, conn)
    print(result)
    # Convert the result DataFrame to a list of dictionaries for JSON serialization
    data_preview = result.head().to_dict(orient='records')

    # Create the bot reply by including the preview of the data
    bot_reply = {
        "message": f"Bot received: {user_message}",
        "filtered_data_preview": data_preview  # Include actual data preview
    }

    # Return the bot's response as JSON
    return jsonify(bot_reply)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
