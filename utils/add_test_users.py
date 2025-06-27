import firebase_admin
from firebase_admin import credentials, auth, firestore
import json

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./amicare-3e988-firebase-adminsdk-o67ir-a07130c044.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Load user data from a JSON file
with open('../../docs/transformed_users_no_id.json', 'r') as f:
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
            'address': {
                'fullAddress': user['address']['fullAddress'],
                'street': user['address']['street'],
                'city': user['address']['city'],
                'province': user['address']['province'],
                'country': user['address']['country'],
                'postalCode': user['address']['postalCode'],
            },
            'phone': user['phone'],
            'email': user['email'],
            'isPsw': user['isPsw'],
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
            'stripeAccountId': user['stripeAccountId'],
        })
        print(f'Successfully added user data to Firestore for: {user_record.uid}')

    except Exception as e:
        print(f'Error creating user or adding data to Firestore: {str(e)}')

# NEW FUNCTION: Add existing users to new collection
def add_existing_users_to_new_collection(user_data, new_collection_name='users_new'):
    try:
        # Get user by email to find their UID
        user_record = auth.get_user_by_email(user_data['email'])
        uid = user_record.uid
        print(f'Found existing user: {user_data["email"]} -> UID: {uid}')

        # Add user data to the new collection using their existing UID
        # Only include fields that are part of the User schema
        user_doc = {
            'firstName': user_data['firstName'],
            'lastName': user_data['lastName'],
            'dob': user_data['dob'],
            # 'age': user_data['age'],  # REMOVED - not part of User schema
            'address': {
                'fullAddress': user_data['address']['fullAddress'],
                'street': user_data['address']['street'],
                'city': user_data['address']['city'],
                'province': user_data['address']['province'],
                'country': user_data['address']['country'],
                'postalCode': user_data['address']['postalCode'],
            },
            'phone': user_data['phone'],
            'email': user_data['email'],
            'isPsw': user_data['isPsw'],
            'onboardingComplete': user_data['onboardingComplete'],
        }
        
        # Add optional fields only if they exist in the data
        if 'gender' in user_data and user_data['gender']:
            user_doc['gender'] = user_data['gender']
        if 'profilePhotoUrl' in user_data and user_data['profilePhotoUrl']:
            user_doc['profilePhotoUrl'] = user_data['profilePhotoUrl']
        if 'rate' in user_data and user_data['rate'] is not None:
            user_doc['rate'] = user_data['rate']
        if 'idVerified' in user_data:
            user_doc['idVerified'] = user_data['idVerified']
        if 'emailVerified' in user_data:
            user_doc['emailVerified'] = user_data['emailVerified']
        if 'phoneVerified' in user_data:
            user_doc['phoneVerified'] = user_data['phoneVerified']
        if 'hasProfilePhoto' in user_data:
            user_doc['hasProfilePhoto'] = user_data['hasProfilePhoto']
        if 'carePreferences' in user_data and user_data['carePreferences']:
            user_doc['carePreferences'] = {
                'lookingForSelf': user_data['carePreferences'].get('lookingForSelf'),
                'careType': user_data['carePreferences'].get('careType'),
                'tasks': user_data['carePreferences'].get('tasks'),
                'availability': user_data['carePreferences'].get('availability'),
            }
        if 'bio' in user_data and user_data['bio']:
            user_doc['bio'] = user_data['bio']
        if 'stripeAccountId' in user_data and user_data['stripeAccountId']:
            user_doc['stripeAccountId'] = user_data['stripeAccountId']
        
        db.collection(new_collection_name).document(uid).set(user_doc)
        print(f'Successfully added existing user to new collection: {uid}')
        return True

    except auth.UserNotFoundError:
        print(f'User not found in Firebase Auth: {user_data["email"]}')
        return False
    except Exception as e:
        print(f'Error adding existing user to new collection: {str(e)}')
        return False

# Use the new function to add existing users to new collection
print("Adding existing users to new collection...")
success_count = 0
error_count = 0
i= 0
for user in users_data:
    # create_user_and_add_to_firestore(user)
    if add_existing_users_to_new_collection(user, 'backend_users_test3'):  # Change collection name as needed
        success_count += 1
    else:
        error_count += 1
    # if i == 2:
    #     break
    # i+=1

print(f"\nCompleted! Successfully added: {success_count}, Errors: {error_count}")

# Original code (commented out)
# i=0
# for user in users_data:
#     create_user_and_add_to_firestore(user)
#     if i == 2:
#         break
#     i+=1