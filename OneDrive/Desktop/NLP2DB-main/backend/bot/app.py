from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from dotenv import load_dotenv
import os
import requests
import google.generativeai as genai
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.exceptions import RefreshError
from google_auth_oauthlib.flow import Flow

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # Add this line near the top

SCOPES = ['https://www.googleapis.com/auth/generative-language.retriever']
load_dotenv()

api_key = os.getenv("API_KEY")
def generate_token():
    flow = InstalledAppFlow.from_client_secrets_file(
        './client_secret.json', SCOPES
    )
    creds = flow.run_local_server(port=0)

    # Save the credentials for the next run
    with open('token.json', 'w') as token:
        token.write(creds.to_json())
    return creds
# Define the Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
# Define the Google API scope
# Function to load OAuth2 credentials
#generate_token()
def load_creds():
    try:
        creds = None
        # Check if token.json exists
        if os.path.exists('token.json'):
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)

        # If credentials are valid, return the creds object
        if creds and creds.valid:
            return creds

        # If credentials are expired but refreshable, refresh them
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
                # Save the refreshed credentials
                with open('token.json', 'w') as token_file:
                    token_file.write(creds.to_json())
                return creds
            except RefreshError:
                # If refresh fails, generate new token
                return generate_token()

        # If no valid credentials, generate new ones
        return generate_token()

    except Exception as e:
        print(f"Authentication error: {str(e)}")
        raise
#load_creds()
@app.route('/oauth2callback')
def oauth2callback():
    try:
        # Get the authorization response URL
        authorization_response = request.url

        # Create the flow instance
        flow = Flow.from_client_secrets_file(
            'client_secret.json',
            scopes=SCOPES,
            redirect_uri='https://nlp2db.netlify.app/oauth2callback'  # Update this URL
        )

        # Exchange authorization code for credentials
        flow.fetch_token(authorization_response=authorization_response)
        credentials = flow.credentials

        # Save credentials
        with open('token.json', 'w') as token:
            token.write(credentials.to_json())

        return jsonify({"success": True, "message": "Authentication successful"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#@app.route('/get-auth-url', methods=['GET'])
#@app.route('/get-auth-url', methods=['GET'])
@app.route('/get-auth-url', methods=['GET'])
def get_auth_urlll():
    try:
        if os.path.exists('token.json'):
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)
            if creds and creds.valid:
                return jsonify({"success": True, "message": "Credentials are valid"})
            """
            elif creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
                return jsonify({"success": True, "message": "Credentials refreshed"})
            """
        # If we get here, we need new credentials
        flow = InstalledAppFlow.from_client_secrets_file(
            'client_secret.json', SCOPES)
        auth_url, _ = flow.authorization_url(prompt='consent')
        return jsonify({"success": False, "auth_url": auth_url})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate-er', methods=['POST'])
def generate_er():
    # Get input data from the POST request
    request_data = request.json

    # Load credentials
    creds = load_creds()

    # Define the request details
    url = "https://generativelanguage.googleapis.com/v1beta/tunedModels/nlptoer-3em1g05ixen4:generateContent"
    project_name = "snappy-stacker-438006-r8"  # Replace with your project name

    # Set headers
    headers = {
        "Authorization": f"Bearer {creds.token}",
        "Content-Type": "application/json",
        "x-goog-user-project": project_name
    }

    # Prepare prompt for the API request
    first = "Generate only the ER object structure for"
    last = "Output only the JSON representation of the ER diagram.eg:()"
    exampleData = """{
        "entities": [
            {
                "name": "User",
                "primaryKey": "userId",
                "attributes": [
                    { "name": "userId", "type": "int" },
                    { "name": "name", "type": "string" },
                    { "name": "email", "type": "string" },
                    { "name": "sharedPlaylists", "type": "array[int]" }
                ]
            },
            {
                "name": "Song",
                "primaryKey": "songId",
                "foreignKey": "companyId",
                "attributes": [
                    { "name": "songId", "type": "int" },
                    { "name": "title", "type": "string" },
                    { "name": "companyId", "type": "int" },
                    { "name": "duration", "type": "float" },
                    { "name": "artistId", "type": "int" },
                    { "name": "albumId", "type": "int" },
                    { "name": "genreId", "type": "int" }
                ]
            }
            # more entities and relationships...
        ]
    }"""
    prompt = first + " " + request_data['description'] + " " + last + exampleData

    # Input data to generate ER objects
    data = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
    }

    # Make the API request
    response = requests.post(url, headers=headers, json=data)

    # Check if the request was successful
    if response.status_code == 200:
        response_data = response.json()  # Get the response as JSON
        try:
            # Extract the generated ER diagram from the response
            er_diagram_structure = response_data['candidates'][0]['content']['parts'][0]['text']

            # Return the generated ER diagram as a JSON response
            return jsonify({"er_diagram": er_diagram_structure})

        except (json.JSONDecodeError, KeyError) as e:
            return jsonify({"error": "Error processing response", "details": str(e)}), 500
    else:
        return jsonify({"error": f"Error: {response.status_code} - {response.text}"}), response.status_code


@app.route('/generate-er-test', methods=['POST'])
def generate_er_test():
    time.sleep(3)
    data="```json\n{\n    \"entities\": [\n        {\n            \"name\": \"Team\",\n            \"primaryKey\": \"teamId\",\n            \"attributes\": [\n                { \"name\": \"teamId\", \"type\": \"int\" },\n                { \"name\": \"name\", \"type\": \"string\" },\n                { \"name\": \"city\", \"type\": \"string\" },\n                { \"name\": \"conference\", \"type\": \"string\" },\n                { \"name\": \"division\", \"type\": \"string\" },\n                { \"name\": \"wins\", \"type\": \"int\" },\n                { \"name\": \"losses\", \"type\": \"int\" },\n                { \"name\": \"ties\", \"type\": \"int\" },\n                { \"name\": \"points\", \"type\": \"int\" }\n            ]\n        },\n        {\n            \"name\": \"Player\",\n            \"primaryKey\": \"playerId\",\n            \"attributes\": [\n                { \"name\": \"playerId\", \"type\": \"int\" },\n                { \"name\": \"name\", \"type\": \"string\" },\n                { \"name\": \"number\", \"type\": \"int\" },\n                { \"name\": \"position\", \"type\": \"string\" },\n                { \"name\": \"goals\", \"type\": \"int\" },\n                { \"name\": \"assists\", \"type\": \"int\" },\n                { \"name\": \"teamId\", \"type\": \"int\" }\n            ]\n        },\n        {\n            \"name\": \"Game\",\n            \"primaryKey\": \"gameId\",\n            \"attributes\": [\n                { \"name\": \"gameId\", \"type\": \"int\" },\n                { \"name\": \"date\", \"type\": \"string\" },\n                { \"name\": \"homeTeamId\", \"type\": \"int\" },\n                { \"name\": \"awayTeamId\", \"type\": \"int\" },\n                { \"name\": \"homeTeamScore\", \"type\": \"int\" },\n                { \"name\": \"awayTeamScore\", \"type\": \"int\" }\n            ]\n        },\n        {\n            \"name\": \"Stats\",\n            \"primaryKey\": \"statsId\",\n            \"attributes\": [\n                { \"name\": \"statsId\", \"type\": \"int\" },\n                { \"name\": \"playerId\", \"type\": \"int\" },\n                { \"name\": \"gameId\", \"type\": \"int\" },\n                { \"name\": \"goals\", \"type\": \"int\" },\n                { \"name\": \"assists\", \"type\": \"int\" },\n                { \"name\": \"shots\", \"type\": \"int\" },\n                { \"name\": \"penaltyMinutes\", \"type\": \"int\" }\n            ]\n        }\n    ],\n    \"relationships\": [\n        {\n            \"from\": \"Player\",\n            \"to\": \"Team\",\n            \"type\": \"plays for\",\n            \"cardinality\": \"many-to-one\"\n        },\n        {\n            \"from\": \"Game\",\n            \"to\": \"Team\",\n            \"type\": \"involves\",\n            \"cardinality\": \"many-to-one\"\n        },\n        {\n            \"from\": \"Stats\",\n            \"to\": \"Player\",\n            \"type\": \"belongs to\",\n            \"cardinality\": \"many-to-one\"\n        },\n        {\n            \"from\": \"Game\",\n            \"to\": \"Stats\",\n            \"type\": \"has\",\n            \"cardinality\": \"one-to-many\"\n        }\n    ]\n}\n```"
    return jsonify({"er_diagram": data})

@app.route('/generate-document', methods=['POST'])
def process_input():
    data = request.get_json()
    er_object = data['er_object']  # Expecting the ER object in the request body

    # Construct a query based on the ER object
    query = create_documentation_query(er_object)

    # Configure the API key for the generative model
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Generate the documentation content based on the query
    response = model.generate_content(query)
    return jsonify({"document": response.text})

def create_documentation_query(er_object):
    """
    Construct a query for generating documentation based on the ER object structure.
    Modify this function based on your ER object structure and desired documentation format.
    """
    # Get entities and relationships from the ER object
    entities = er_object.get('entities', [])
    relationships = er_object.get('relationships', [])

    # Create a formatted string for documentation
    documentation_parts = []
    documentation_parts.append("ER Diagram Documentation: You are asked to create a well-defined documentation for the ER diagram below. Give me well-defined documentation.")

    # Adding entities to the documentation
    for entity in entities:
        documentation_parts.append(f"Entity: {entity['name']}")

        # Extracting attribute names
        attribute_names = [attr['name'] for attr in entity['attributes']]
        documentation_parts.append(f"Attributes: {', '.join(attribute_names)}")
        documentation_parts.append("")  # Adding a blank line for spacing

    # Adding relationships to the documentation
    for relationship in relationships:
        documentation_parts.append(f"Relationship: {relationship['type']}")  # Assuming you want to use the 'type' key
        documentation_parts.append(f"From Entity: {relationship['from']}")
        documentation_parts.append(f"To Entity: {relationship['to']}")
        documentation_parts.append("")  # Adding a blank line for spacing

    return "\n".join(documentation_parts)

@app.route('/generate-er-prompt', methods=['POST'])
def generate_er_prompt():
    data = request.get_json()
    project_requirement = data.get('requirement', '')

    # Construct a prompt for the NLP2ER model based on the project requirement
    prompt = create_er_model_prompt(project_requirement)

    # Configure the API key for the generative model
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Generate the response based on the prompt
    response = model.generate_content(prompt)
    return jsonify({"er_model_prompt": response.text})
@app.route('/generate-er-prompt-test', methods=['POST'])
def generate_er_prompt_test():
    # Test data
    time.sleep(3)
    data="test data"
    return jsonify({"er_model_prompt": data})
def create_er_model_prompt(requirement):
    """
    Construct a prompt based on user requirements to guide the NLP2ER model.
    """
    # Create a detailed prompt for database structure generation
    prompt = (
        f"Project Requirement Analysis: You are asked to analyze the following project requirement:\n\n"
        f"'{requirement}'\n\n"
        "Identify and list the database tables, attributes, and relationships that would be needed to "
        "fulfill this requirement. Describe the entities, primary and foreign keys, and how the entities are "
        "related to each other. Use natural language for the description.\n\n"
        "Response:"
    )
    return prompt
# Run the app
if __name__ == '__main__':
    app.run(debug=True)
