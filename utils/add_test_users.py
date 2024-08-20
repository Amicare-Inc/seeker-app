import firebase_admin
from firebase_admin import credentials, auth, firestore
import json

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./utils/firebase-key.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Load user data from a JSON file
with open('./test/user_test_data.json', 'r') as f:
    users_data = json.load(f)

# Function to authenticate and add user data to Firestore
def create_user_and_add_to_firestore(user):
    try:
        # Create a user with email and password
        user_record = auth.create_user(
            email=user['email'],
            password="asdfgh",
        )
        print(f'Successfully created user: {user_record.uid}')

        # Add user data to Firestore
        db.collection('personal').document(user_record.uid).set({
            'firstName': user['firstName'],
            'lastName': user['lastName'],
            'age': user['age'],
            'address': user['address'],
            'phone': user['phone'],
            'email': user['email'],
            'isPSW': user['isPsw']
        })
        print(f'Successfully added user data to Firestore for: {user_record.uid}')

    except Exception as e:
        print(f'Error creating user or adding data to Firestore: {str(e)}')

# Iterate through the list of users and process each on
i = 0
for user in users_data:
    create_user_and_add_to_firestore(user)
    if i == 10:
        break
    i+=1