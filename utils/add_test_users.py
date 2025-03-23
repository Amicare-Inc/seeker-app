import firebase_admin
from firebase_admin import credentials, auth, firestore
import json

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./firebase-key.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Load user data from a JSON file
with open('../test/user_test_data2_2.json', 'r') as f:
    users_data = json.load(f)
print("Number of users: ", len(users_data))

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
        db.collection('test1').document(user_record.uid).set({
            'firstName': user['firstName'],
            'lastName': user['lastName'],
            'dob': user['dob'],  # Date of Birth in MM/DD/YYYY
            'age': user['age'],  # Age calculated from DOB
            'address': user['address'],
            'phone': user['phone'],
            'email': user['email'],
            'isPsw': user['isPsw'],
            'gender': user['gender'],  # Male or Female
            'profilePhotoUrl': user.get('profilePhotoUrl', ''),  # Handle empty case
            'rate': user.get('rate', None),  # Only applicable if PSW
            'idVerified': user['idVerified'],
            'emailVerified': user['emailVerified'],
            'phoneVerified': user['phoneVerified'],
            'hasProfilePhoto': user['hasProfilePhoto'],
            # Care Preferences
            'carePreferences': {
                'lookingForSelf': user['carePreferences']['lookingForSelf'],
                'careType': user['carePreferences']['careType'],
                'tasks': user['carePreferences']['tasks'],
                'availability': user['carePreferences']['availability'],
            },
            'bio': user['bio'],  # Long personal bio
            'onboardingComplete': user['onboardingComplete'],

        })
        print(f'Successfully added user data to Firestore for: {user_record.uid}')

    except Exception as e:
        print(f'Error creating user or adding data to Firestore: {str(e)}')

i=0
for user in users_data:
    create_user_and_add_to_firestore(user)
    # if i == 2:
    #     break
    # i+=1