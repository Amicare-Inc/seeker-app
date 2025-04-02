import firebase_admin
from firebase_admin import credentials, firestore

# Define the mappings for careType and tasks
care_type_mapping = {
    "Option 1": "Personal Care",
    "Option 2": "Medication Management",
    "Option 3": "Mobility Assistance",
    "Option 4": "Household Support",
    "Option 5": "Meal Preparation",
    "Option 6": "Companionship",
    "Option 7": "Transportation",
    "Option 8": "Errand Running"
}

task_mapping = {
    "Option 1": "Bathing Assistance",
    "Option 2": "Dressing Assistance",
    "Option 3": "Grooming Support",
    "Option 4": "Toileting Assistance",
    "Option 5": "Light Housekeeping",
    "Option 6": "Grocery Shopping",
    "Option 7": "Medication Reminders",
    "Option 8": "Emotional Support"
}

# Initialize Firebase Admin using your service account key.
cred = credentials.Certificate("./firebase-key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def update_user_doc(doc_ref, data):
    try:
        doc_ref.update(data)
        print(f"Updated document: {doc_ref.id}")
    except Exception as e:
        print(f"Error updating {doc_ref.id}: {e}")

def main():
    # Get all documents from the "test1" collection.
    users_ref = db.collection("test1")
    docs = users_ref.stream()

    for doc in docs:
        user_data = doc.to_dict()
        updated_fields = {}

        # Check if carePreferences exists
        if "carePreferences" in user_data:
            care_prefs = user_data["carePreferences"]

            # Update careType array if it exists
            if "careType" in care_prefs and isinstance(care_prefs["careType"], list):
                new_care_type = []
                for option in care_prefs["careType"]:
                    new_value = care_type_mapping.get(option, option)
                    new_care_type.append(new_value)
                updated_fields["carePreferences.careType"] = new_care_type

            # Update tasks array if it exists
            if "tasks" in care_prefs and isinstance(care_prefs["tasks"], list):
                new_tasks = []
                for option in care_prefs["tasks"]:
                    new_value = task_mapping.get(option, option)
                    new_tasks.append(new_value)
                updated_fields["carePreferences.tasks"] = new_tasks

            if updated_fields:
                update_user_doc(doc.reference, updated_fields)
        # break

if __name__ == "__main__":
    main()