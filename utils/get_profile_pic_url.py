import firebase_admin
from firebase_admin import credentials, storage

# Initialize Firebase Admin SDK
cred = credentials.Certificate('./firebase-key.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'amicare-3e988.firebasestorage.app'
})

def list_files_and_get_download_urls(directory_path):
    bucket = storage.bucket()
    blobs = bucket.list_blobs(prefix=directory_path)
    download_urls = []

    for blob in blobs:
        # Fetch the blob's metadata
        blob.reload()
        # Retrieve the token from metadata
        token = blob.metadata.get('firebaseStorageDownloadTokens')
        if token:
            download_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/{blob.name}?alt=media&token={token}"
            download_urls.append(download_url)
        else:
            print(f"No download token found for {blob.name}. Skipping...")

    return download_urls

# Example usage
directory_path = 'test1profilePhotos/'  # Ensure this is the correct path in your bucket
urls = list_files_and_get_download_urls(directory_path)
for url in urls:
    print(url)