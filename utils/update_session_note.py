import firebase_admin
from firebase_admin import credentials, firestore

# Define the mapping for tasks (you can adjust these if needed)
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

def update_session_note(doc_ref, new_note):
    try:
        doc_ref.update({"note": new_note})
        print(f"Updated document: {doc_ref.id}")
    except Exception as e:
        print(f"Error updating {doc_ref.id}: {e}")

def main():
    # Reference to the "sessions_test1" collection
    sessions_ref = db.collection("sessions_test1")
    docs = sessions_ref.stream()

    for doc in docs:
        data = doc.to_dict()
        original_note = data.get("note", "")
        if original_note and isinstance(original_note, str):
            # Split the note by commas, trim whitespace, and map each option using the task_mapping
            options = [opt.strip() for opt in original_note.split(",")]
            mapped_options = [task_mapping.get(opt, opt) for opt in options]
            # Join the mapped options back together with a comma and a space
            new_note = ", ".join(mapped_options)
            if new_note != original_note:
                update_session_note(doc.reference, new_note)
        else:
            print(f"No valid note in document {doc.id}")
        # break

if __name__ == "__main__":
    main()