import React from 'react';
import {
View,
Text,
Modal,
ScrollView,
TouchableOpacity,
StyleSheet,
} from 'react-native';

interface PrivacyPolicyLinkProps {
textStyle?: any;
onPress: () => void;
}

interface PrivacyPolicyModalProps {
visible: boolean;
onClose: () => void;
}

// Clickable Privacy Policy link component
export function PrivacyPolicyLink({ textStyle, onPress }: PrivacyPolicyLinkProps) {
return (
<Text style={[{ color: '#0c7ae2' }, textStyle]} onPress={onPress}>
Privacy Policy
</Text>
);
}

// Privacy Policy modal component
export function PrivacyPolicyModal({ visible, onClose }: PrivacyPolicyModalProps) {
return (
<Modal
animationType="slide"
transparent={false}
visible={visible}
onRequestClose={onClose}
>
<View style={{ flex: 1, backgroundColor: 'white' }}>
<View style={styles.container}>
{/* Header */}
<View style={styles.header}>
<Text style={styles.headerTitle}>Privacy Policy</Text>
<TouchableOpacity onPress={onClose}>
<Text style={styles.closeText}>Close</Text>
</TouchableOpacity>
</View>

<ScrollView contentContainerStyle={styles.contentContainer}>

<Text style={styles.sectionTitle}>Introduction</Text>

<Text style={styles.paragraph}>
In this Privacy Policy, <Text style={{ fontWeight: 'bold' }}>"Amicare," "we," "us," and "our"</Text> refer to Amicare Inc., located at 18 King Street East, Suite 1400, Toronto, ON M5C 1C4, Canada.
<Text style={{ fontWeight: 'bold' }}> "Amicare"</Text> is a mobile marketplace platform that connects individuals seeking caregiving services (<Text style={{ fontWeight: 'bold' }}>"care seekers"</Text>)
with professional caregivers (<Text style={{ fontWeight: 'bold' }}>"caregivers"</Text>). <Text style={{ fontWeight: 'bold' }}>"You"</Text> and <Text style={{ fontWeight: 'bold' }}>"your"</Text> refer to any individual who accesses or uses our services,
whether as a care seeker, caregiver, or visitor to our website or mobile app. You can contact us using the 
details provided below. This policy explains how we collect, use, and protect your 
personal information when you use our mobile app and website (collectively, our 
"services").
</Text>

<Text style={styles.paragraph}>
This Privacy Policy starts on July 25, 2025 and was last updated on July 25, 2025. We will notify you of any material changes to this Privacy Policy at least 30 days 
before they take effect through: 
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• A prominent in-app notification</Text>
<Text style={styles.bullet}>• An email to your registered email address</Text>
<Text style={styles.bullet}>• A notice on our website's homepage</Text>
</View>

<Text style={styles.paragraph}>
For material changes that significantly affect your privacy rights or how we use your 
personal information, we will request your explicit consent through an in-app prompt 
before the changes take effect. This prompt will clearly explain:
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• What is changing in the Privacy Policy</Text>
<Text style={styles.bullet}>• How it affects your privacy rights </Text>
<Text style={styles.bullet}>• The consequences of accepting or declining</Text>
<Text style={styles.bullet}>• A link to compare the old and new versions</Text>
</View>

<Text style={styles.paragraph}>
For minor changes (such as clarifications or updates to contact information), we will 
notify you through the app and email, but won't require explicit re-consent. Continuing to 
use our services after such minor changes indicates your acceptance of the updated 
terms. 
</Text>

<Text style={styles.paragraph}>
If you don't agree with any changes, you may close your account before they take effect. 
By continuing to use our services after declining material changes, some features may 
become unavailable. 
</Text>

<Text style={styles.sectionTitle}>Information We Collect</Text>

<Text style={styles.paragraph}>
We collect different types of information depending on how you use Amicare. This 
includes information you provide directly and information about dependents or care 
recipients when you arrange care for others. Here's a detailed breakdown of what we 
collect: 
</Text>

<Text style={styles.paragraph}>
General Information (All Users): 
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• Basic Profile Information: Full name, date of birth, gender, email address, mobile number, full address, preferred languages, and an optional bio</Text>
<Text style={styles.bullet}>• Profile Photos: Optional profile pictures to help build trust in the community</Text>
<Text style={styles.bullet}>• Family Member Details: Name, photo, email, phone number, geolocation, primary contact status, and relationship to the care recipient (all optional)</Text>
<Text style={styles.bullet}>• Ratings: Star ratings received from or given to other users</Text>
<Text style={styles.bullet}>• Session Information: Logs of care sessions, notes, and reviews</Text>
<Text style={styles.bullet}>• Preferences: Gender preferences for matching, specific session requirements, and compatibility factors (such as language preferences or experience needs)</Text>
<Text style={styles.bullet}>• Emergency Contacts: Optional emergency contact information</Text>
<Text style={styles.bullet}>• Service Areas: General location for matching (service area for caregivers, address for care seekers)</Text>
<Text style={styles.bullet}>• Financial Information: Preferred hourly rates (caregivers) or care budgets (care seekers)</Text>
</View>

<Text style={styles.paragraph}>
Care Seeker-Specific Information: 
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• Care Details: Relationship to care recipient (if booking for someone else), specific care tasks needed</Text>
<Text style={styles.bullet}>• Preferences: Preferred caregiver gender, driving requirements</Text>
<Text style={styles.bullet}>• Care Description: A bio describing care needs (excluding medical history or sensitive health information)</Text>
<Text style={styles.bullet}>• Next of Kin: Emergency contact information for the care recipient</Text>
<Text style={styles.bullet}>• Service Location: Where care will be provided if different from your address</Text>
<Text style={styles.bullet}>• Care Needs: Specific support requirements and tasks needed (without collecting medical diagnoses)</Text>
<Text style={styles.bullet}>• Relationship: How you are related to the care recipient (e.g., son, daughter, spouse)</Text>
<Text style={styles.bullet}>• Basic Details: First name, last name, gender, and date of birth of the person receiving care</Text>
</View>

<Text style={styles.paragraph}>
Dependent/Care Recipient Information (When Booking for Others): 
</Text>

<Text style={styles.paragraph}>
Caregiver-Specific Information: 
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• Identity Verification: Government-issued ID and biometric information (such as facial geometry from your selfie) (processed through Persona)</Text>
<Text style={styles.bullet}>• Qualifications: Government-issued driver's license, driver's license abstract, criminal record check with vulnerable sector screening, basic first aid certification, vaccination record, PSW/HSW or community support worker certification, food safety certification, resume, non-violent crisis intervention certification, and other relevant qualification documents as required</Text>
<Text style={styles.bullet}>• Financial Details: Banking information for receiving payments</Text>
<Text style={styles.bullet}>• Professional Information: Skills, experience, qualifications, total number of completed care sessions, total hours of care delivered, overall star rating, and availability/preferred schedule (visible to all users before booking)</Text>
</View>

<Text style={styles.paragraph}>
How We Collect This Information:
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• Direct Input: Information you provide during sign-up, onboarding, and profile creation</Text>
<Text style={styles.bullet}>• File Uploads: Documents you upload such as certifications, resume, or ID</Text>
<Text style={styles.bullet}>• Third-Party Services: Identity verification through Persona, payment processing through Stripe</Text>
<Text style={styles.bullet}>• Platform Activity: Information gathered through your use of our services (session logs, star ratings, messages)</Text>
<Text style={styles.bullet}>• Optional Family Information: Details about dependents and family members that you choose to provide when arranging care for others</Text>
</View>

<Text style={styles.sectionTitle}>Children’s Privacy</Text>

<Text style={styles.paragraph}>
Amicare’s platform and services are not intended for use by individuals under 18 years 
of age. We do not knowingly collect personal information directly from anyone under the 
age of 18. If you are under 18, please do not create an account or use our services – a 
parent or legal guardian must do so on your behalf. If we discover that we have 
unintentionally collected personal data from a minor without proper consent, we will 
delete that information. If you are a parent or guardian and believe your child (under 18) 
has provided personal information to Amicare, please contact us so we can remove it.
</Text>

<Text style={styles.sectionTitle}>Accountability</Text>

<Text style={styles.paragraph}>
We've appointed a Privacy Officer to protect your privacy. This person makes sure we 
follow privacy laws and oversees how we handle your personal information. If you have 
questions or concerns about your information, you can contact our Privacy Officer 
directly.
</Text>

<Text style={styles.paragraph}>
Contact information for the Privacy Officer is as follows:
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• Email: privacy@amicare.io</Text>
<Text style={styles.bullet}>• Phone: +1 (888) 994-9114</Text>
<Text style={styles.bullet}>• Postal Address: 18 King Street East, Suite 1400, Toronto, ON M5C 1C4, Canada</Text>
</View>

<Text style={styles.paragraph}>
Contact our Privacy Officer with any questions or concerns about your personal information.
</Text>

<Text style={styles.sectionTitle}>Purposes of Collection</Text>

<Text style={styles.paragraph}>
This Privacy Policy explains why we collect, use, and share your personal information. 
We use your information for the following specific purposes: 
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• Account Creation and Management: Creating and managing your user account, including profile settings and preferences.</Text>
<Text style={styles.bullet}>• Identity Verification: Verifying your identity through Persona or other verification services for fraud prevention and building trust in our community.</Text>
<Text style={styles.bullet}>• Matching and Scheduling: Matching care seekers with suitable caregivers based on needs, preferences, availability, and managing care schedules.</Text>
<Text style={styles.bullet}>• Communications: Helping you communicate with other users and with us.</Text>
<Text style={styles.bullet}>• Payments: Managing bookings, schedules, and payments through Stripe.</Text>
<Text style={styles.bullet}>• Reviews and Feedback: Collecting, managing, and displaying ratings and reviews to maintain service quality and help users make informed decisions.</Text>
<Text style={styles.bullet}>• Customer Support: Providing support and responding to your questions or issues.</Text>
<Text style={styles.bullet}>• Service Improvement and Analytics: Improving our app and services, including support and analysis.</Text>
<Text style={styles.bullet}>• Legal Compliance and Fraud Prevention: Meeting legal requirements like preventing fraud.</Text>
</View>

<Text style={styles.paragraph}>
By using our app, you agree to let us collect, use, and share your information for these 
purposes.
</Text>

<Text style={styles.sectionTitle}>Consent</Text>

<Text style={styles.paragraph}>
By using our services, you agree to how we collect, use, and share your personal 
information as described in this Privacy Policy. This includes both information about 
yourself and about any dependents or care recipients for whom you arrange care. We 
employ multiple consent mechanisms throughout our platform to ensure transparency 
and user control: 
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• Initial Sign-up Consent: During account creation, you must actively check an unchecked box confirming that you have read and agree to our Privacy Policy and Terms of Service. Each checkbox is separate and clearly labeled. We never use pre-ticked boxes or assume your consent. The full policies are readily accessible via prominent links, with key points summarized in plain language next to the checkboxes.</Text>
<Text style={styles.bullet}>• In-App Consent Mechanisms:</Text>
<Text style={styles.bullet}>   • Profile Information: When adding information to your profile, clear tooltips explain how each piece of information will be used and who can see it.</Text>
<Text style={styles.bullet}>   • Privacy Controls: Your profile settings include granular toggles for controlling what information is visible to other users, with clear explanations of the implications of each setting.</Text>
<Text style={styles.bullet}>   • Session Booking: Before confirming a care session, a dedicated screen clearly shows what information will be shared with the other party (including any dependent information) and requires explicit confirmation with the notice: "By sending this request, you agree to share this information with your matched caregiver."</Text>
<Text style={styles.bullet}>   • Location Services: When location access is needed for matching, a clear notification explains the purpose and requests your permission.</Text>
<Text style={styles.bullet}>   • Communications Preferences: We use two distinct consent mechanisms for different types of communications (each type can be managed separately in your communication preferences):</Text>
<Text style={styles.bullet}>      • 1. Essential Service Communications (automatic): Account security, booking confirmations, session reminders, and service updates</Text>
<Text style={styles.bullet}>      • 2. Promotional Communications (opt-in required): Marketing offers, feature announcements, referral programs, and promotional incentives</Text>
</View>

<Text style={styles.paragraph}>
If you are arranging care for an adult who can provide their own consent, we encourage 
you to review our privacy practices with them. You must explicitly confirm sharing 
dependent information with caregivers through a dedicated consent checkbox. We 
provide clear notices explaining how dependent information will be used and who can 
see it. When you provide information about a dependent or care recipient, you confirm 
that you have the legal authority to share their information and consent on their behalf. 
Only individuals with legal authority, such as a parent, legal guardian, or person with duly 
authorized power of attorney or similar legal authorization, may provide dependent 
information and consent on a dependent's behalf. If you do not have such legal 
authority, you must not provide information about another person or attempt to arrange 
care on their behalf. 
</Text>

<Text style={styles.paragraph}>
Consent for Dependent Information:
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• Progressive Consent Collection and Communications: For certain data processing activities and communications, we obtain additional explicit consent at the point of use. We distinguish between essential service communications and promotional messages:</Text>
<Text style={styles.bullet}>   • Identity Verification: Before initiating ID verification through Persona, we present a dedicated consent screen explaining the process, data collected, and its purpose.</Text>
<Text style={styles.bullet}>   • Sensitive Information: When adding optional sensitive information (like emergency contacts or care preferences), clear notices explain the purpose and you must explicitly confirm sharing.</Text>
<Text style={styles.bullet}>   • Background Checks: Caregivers must provide separate consent for background check processing, with clear explanation of the scope and purpose.</Text>
<Text style={styles.bullet}>   • Communications Management: Our dedicated preferences (which can be modified at any time) center allows you to:</Text>
<Text style={styles.bullet}>      • Control essential service notifications (in-app, email, or SMS)</Text>
<Text style={styles.bullet}>      • Opt in/out of promotional communications (opting out of promotional messages won't affect essential service communications)</Text>
<Text style={styles.bullet}>      • Choose notification frequency and channels</Text>
<Text style={styles.bullet}>      • Customize types of updates you receive</Text>
<Text style={styles.bullet}>   • Third-Party Integrations: When connecting to services like payment processors or scheduling tools, clear consent notices explain what data will be shared.</Text>
<Text style={styles.bullet}>• You may decline any of these optional data uses while still accessing our core services. Each consent request includes clear information about the purpose, data involved, and consequences of declining.</Text>
</View>

<Text style={styles.paragraph}>
Withdrawing Consent: 
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• You can withdraw your consent at any time by:</Text>
<Text style={styles.bullet}>   • Contacting our Privacy Officer using the contact information provided in this policy</Text>
<Text style={styles.bullet}>   • Requesting account deletion through our app or by contacting us</Text>
<Text style={styles.bullet}>   • Adjusting your privacy preferences in your account settings</Text>
<Text style={styles.bullet}>• We will explain the consequences of withdrawing consent, such as our inability to provide certain services. Note that withdrawing consent will not affect our processing of your information based on consent before its withdrawal.</Text>
<Text style={styles.bullet}>• Parents or guardians can withdraw permission for children or dependent adults using the same process. For dependent information you've provided, you can withdraw consent to process this information through the same channels.</Text>
</View>

<Text style={styles.sectionTitle}>Mobile App Permissions</Text>

<Text style={styles.paragraph}>
The Amicare mobile app may request access to certain features or data on your device, 
but only to enable core functionality of the service. We want to be clear about these: 
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>
• Location: With your permission, we may use your device’s approximate location (city/neighborhood level, not precise GPS tracking) to help match you with caregivers or care seekers in your vicinity and to show relevant services in your area. You will be prompted by your phone to allow location access, and you can decline – if you do, you can manually enter your city or postal code to find matches. We do not track your real-time movements; location is used only for matchmaking and is not shared publicly (other users see at most your general area, as noted above).
</Text>
<Text style={styles.bullet}>
• Camera and Photos: We ask for camera access if you choose to take a profile photo in-app or when verifying your identity through Persona. This lets you snap a photo of yourself or your ID document. We may also ask for access to your photo gallery if you prefer to upload an existing picture. Again, you will see an OS permission request, and it’s up to you to allow it. Images you provide are used solely for your profile (visible to others in the community) or for identity verification (handled by Persona).
</Text>
<Text style={styles.bullet}>
• Notifications: After you install the app, it will ask for your permission to send you push notifications. If allowed, we use these to notify you about important account activities – for example, booking requests, messages from other users, or updates on a session. You can always turn off Amicare notifications later in your phone settings if you prefer not to receive them.
</Text>
<Text style={styles.bullet}>
• Microphone (Not Used): Our app does not require or use your microphone or any audio recording.
</Text>
</View>

<Text style={styles.paragraph}>
We will only ask for each permission when it’s needed, and your device will prompt you 
to allow or deny it. If you give permission and later change your mind, you can revoke 
that permission in your device settings (the app will respect your choice, though some 
features might become unavailable). 
</Text>

<Text style={styles.sectionTitle}>Limiting Collection, Use, Disclosure, and Retention </Text>

<Text style={styles.paragraph}>
We only collect the personal information we need for the purposes we explain to you 
when we collect it. We'll clearly tell you why we need your information, either directly 
when collecting it or through our privacy notices.
</Text>

<Text style={styles.paragraph}>
We only share your personal information with outside parties for the purposes that you 
have agreed to, and we do so with great care. To provide our services, we partner with a 
number of trusted third-party providers and share personal information with them as 
necessary. We have data protection agreements in place with these partners to ensure 
they safeguard your data. This section describes these partners and the purposes for 
which we share data with them. For caregivers, after successful verification through 
Persona, we store qualification documents in HubSpot for ongoing credential 
management and compliance tracking. Below is a comprehensive list of our trusted 
service providers and the types of personal information they process to help us run 
Amicare:
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>
• Persona (Identity Verification): Processes government-issued ID documents, captures biometric information (such as facial geometry from your selfie), and performs identity verification for both caregivers and care seekers. For caregivers, Persona also processes all qualification documents including driver's license, driver's license abstract, criminal record check with vulnerable sector screening, certifications, and other credentials for initial verification. During our early access phase, some caregiver qualification documents (e.g., certifications and background checks) may be submitted via secure email instead of through Persona. All ID and biometric verification is still handled via Persona. All documents are stored securely and managed in accordance with PHIPA/PIPEDA compliance protocols. They receive your ID documents, biometric information, qualification documents, and basic personal information to verify your identity and credentials. In accordance with our provider's policies, biometric identifiers collected during verification are securely and permanently destroyed within three years of your last interaction with the verification service. Amicare receives verification results, reviews all caregiver documentation, and maintains ongoing access to these documents for compliance monitoring. Persona is SOC 2 and GDPR-compliant but processes data in the United States on AWS servers.
</Text>
<Text style={styles.bullet}>
• HubSpot (Credential Management): For approved caregivers only, stores and manages verified qualification documents including licenses, certifications, background checks, and other credentials. Data is stored on HubSpot's secure servers in the United States, with SOC 2 Type II compliance.
</Text>
<Text style={styles.bullet}>
• Stripe (Payments): Processes payment transactions and handles payouts on our behalf. In providing these services, Stripe also acts as an independent data controller. This means that Stripe may use your transaction data to comply with its own legal obligations and for its own business purposes, such as operating and improving its services, which includes its global fraud detection and prevention network. They receive names, bank account information, payment method details, and transaction history to facilitate secure payments between care seekers and caregivers. You can learn more by reviewing Stripe's Privacy Policy. Stripe is PCI DSS compliant but stores data globally with primary operations in the United States.
</Text>
<Text style={styles.bullet}>
• Google Cloud and Firebase (Hosting, Authentication & Storage): Provides authentication, database, storage, and crash reporting services. They process account data, session logs, user-uploaded content, and app analytics. Firebase data is primarily processed in the United States, while some Google Cloud storage is located in Canada. These services comply with SOC 2 and ISO standards.
</Text>
<Text style={styles.bullet}>
• Customer.io (Communications): Manages and sends our essential service communications (such as account alerts and booking confirmations) as well as promotional messages for which you have provided opt-in consent. To do this, it processes your contact information (e.g., name, email address) and information about your interaction with our platform. Data is stored on AWS servers in Oregon, United States.
</Text>
<Text style={styles.bullet}>
• Intercom (Support Services): Provides in-app support, chat, and user messaging capabilities, processing your name, email, and user actions to facilitate customer support interactions. When you interact with our customer support team via the in-app chat feature (provided by Intercom), your conversations may be monitored and recorded. We do this for quality assurance, for training purposes, and to help us improve our services. Intercom primarily processes data in the United States.
</Text>
<Text style={styles.bullet}>
• HubSpot (CRM & Marketing): Manages customer relationships, marketing emails, and form submissions, processing contact information and interaction history. HubSpot primarily processes data in the United States but uses a global CDN and supports Data Processing Addendums.
</Text>
<Text style={styles.bullet}>
• Analytics Tools: We use multiple tools to understand how our services are used and to improve them:
</Text>
<Text style={styles.bullet}>
• Twilio Segment: Twilio Segment is a platform we use to collect, manage, and route analytics data to our other analytics tools. In providing this service, Twilio may also use data as an independent controller to secure, support, and improve its own platform services, including for the prevention of fraud and abuse. Twilio Segment is U.S.-based and processes data primarily in the United States.
</Text>
<Text style={styles.bullet}>
• Mixpanel: Processes behavioral analytics data, including user ID, usage events, session flows, and device data. Mixpanel stores data in the United States and is GDPR and SOC 2 compliant.
</Text>
<Text style={styles.bullet}>
• Google Analytics: We use Google Analytics to collect and analyze information about how users interact with our services. This helps us to improve our platform and user experience. Google Analytics uses cookies and other identifiers to collect data. To learn how Google collects and processes data, you must review the information at 'How Google uses information from sites or apps that use our services,' which is available at www.google.com/policies/privacy/partners/. You can prevent your data from being used by Google Analytics by installing the Google Analytics Opt-out Browser Add-on, available at https://tools.google.com/dlpage/gaoptout. Default Google Analytics data is processed in the United States.
</Text>
</View>

<Text style={styles.paragraph}>
For our website users, we also use cookies and similar tracking technologies to collect 
information about your browsing behavior and preferences. These technologies help us 
analyze website traffic, personalize content, and deliver targeted advertisements. You 
can control cookie preferences through your browser settings. We use analytics tools 
like Mixpanel to understand user behavior and improve our app. For detailed 
information about the cookies we use and how to manage them, please visit our Cookie 
Notice at www.amicare.io/cookies. Note that our mobile app does not use cookies or 
browser-based tracking technologies. We have agreements in place with all these 
partners to ensure they only use your data for our specified purposes and protect it to a 
comparable standard. 
</Text>

<Text style={styles.paragraph}>
In our marketplace, information sharing between care seekers and caregivers is 
carefully controlled: 
</Text>

<Text style={styles.paragraph}>
Caregiver Profiles Visible Pre-Booking:
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• First name and last initial</Text>
<Text style={styles.bullet}>• Profile image (optional)</Text>
<Text style={styles.bullet}>• Hourly rate</Text>
<Text style={styles.bullet}>• General location and approximate distance</Text>
<Text style={styles.bullet}>• Languages spoken</Text>
<Text style={styles.bullet}>• Compatibility markers</Text>
<Text style={styles.bullet}>• Experience and certifications</Text>
<Text style={styles.bullet}>• Detailed skill set</Text>
<Text style={styles.bullet}>• Short bio</Text>
<Text style={styles.bullet}>• Star ratings (with explicit consent), total number of sessions completed, total hours of care delivered</Text>
<Text style={styles.bullet}>• Availability and preferred schedule</Text>
</View>

<Text style={styles.paragraph}>
Care Seeker Profiles Visible Pre-Booking: 
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• First name and last initial</Text>
<Text style={styles.bullet}>• City/neighborhood</Text>
<Text style={styles.bullet}>• Language preferences</Text>
<Text style={styles.bullet}>• Family member details (first name, initial, photo)</Text>
<Text style={styles.bullet}>• Relationship to care recipient</Text>
<Text style={styles.bullet}>• Gender preference for caregiver</Text>
<Text style={styles.bullet}>• General care needs</Text>
<Text style={styles.bullet}>• Profile image</Text>
<Text style={styles.bullet}>• Tasks requested</Text>
<Text style={styles.bullet}>• Preferred schedule</Text>
</View>

<Text style={styles.paragraph}>
Additional Information Shared Post-Booking:
</Text>

<Text style={styles.paragraph}>
For Caregivers: 
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• Access to messaging interface</Text>
<Text style={styles.bullet}>• Specific service location</Text>
<Text style={styles.bullet}>• Care recipient's name and relation</Text>
<Text style={styles.bullet}>• Emergency contact information</Text>
<Text style={styles.bullet}>• Session times and dates</Text>
<Text style={styles.bullet}>• Previous session notes (if applicable)</Text>
</View>

<Text style={styles.paragraph}>
We limit information sharing to what's necessary for safe and informed connections, 
with additional details only provided after mutual booking acceptance.
</Text>

<Text style={styles.paragraph}>
We may also disclose your personal information if we are legally required to do so (for 
example, responding to a court order or lawful government request), or if it's necessary 
to protect the rights, property, or safety of you, Amicare, or others (for instance, to 
prevent fraud or abuse on our platform). 
</Text>

<Text style={styles.paragraph}>
We do not sell your personal information to anyone.
</Text>

<Text style={styles.paragraph}>
We maintain specific retention schedules for different types of personal information. 
For your clarity, we've summarized the retention periods for key data categories below: 
</Text>

<View style={{ marginVertical: 16 }}>
<Text style={[styles.sectionTitle, { marginBottom: 8 }]}>
Data Retention Schedule
</Text>
<View style={{
borderWidth: 1,
borderColor: '#ccc',
borderRadius: 4,
overflow: 'hidden'
}}>
{/* Table Header */}
<View style={{ flexDirection: 'row', backgroundColor: '#f7f7f7', borderBottomWidth: 1, borderColor: '#ccc' }}>
<View style={{ flex: 2, padding: 8 }}>
<Text style={{ fontWeight: 'bold', fontSize: 14 }}>Data Category</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text style={{ fontWeight: 'bold', fontSize: 14 }}>Retention Period</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text style={{ fontWeight: 'bold', fontSize: 14 }}>Post-Retention Action</Text>
</View>
</View>
{/* Table Rows */}
<View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee' }}>
<View style={{ flex: 2, padding: 8 }}>
<Text>Account Data (profile information)</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>Active use + 2 years after closure</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>Secure deletion or anonymization</Text>
</View>
</View>
<View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee' }}>
<View style={{ flex: 2, padding: 8 }}>
<Text>User Credentials & Authentication</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>Active use + 2 years after closure</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>Secure deletion</Text>
</View>
</View>
<View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee' }}>
<View style={{ flex: 2, padding: 8 }}>
<Text>Care Session Records (logs, notes)</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>10 years from last service date</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>Secure deletion or anonymization</Text>
</View>
</View>
<View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee' }}>
<View style={{ flex: 2, padding: 8 }}>
<Text>Caregiver Credentials, Verification & Qualification Documents</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>7–10 years after last active session</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>Secure deletion</Text>
</View>
</View>
<View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee' }}>
<View style={{ flex: 2, padding: 8 }}>
<Text>Chat & Support Logs</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>2 years from interaction date</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>Secure deletion</Text>
</View>
</View>
<View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee' }}>
<View style={{ flex: 2, padding: 8 }}>
<Text>Payment Records</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>Minimum 7 years (tax compliance)</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>Tokenization and anonymization</Text>
</View>
</View>
<View style={{ flexDirection: 'row' }}>
<View style={{ flex: 2, padding: 8 }}>
<Text>Analytics & Session Data</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>12–24 months (identifiable data)</Text>
</View>
<View style={{ flex: 2, padding: 8 }}>
<Text>Anonymization or deletion</Text>
</View>
</View>
</View>
</View>

<Text style={styles.paragraph}>
These retention periods may be extended if required by law, ongoing disputes, or 
legitimate business needs. When retention periods expire, we securely delete or 
irreversibly anonymize the data according to our data disposal procedures. 
</Text>

<Text style={styles.paragraph}>
When your personal information is no longer needed, we will safely destroy or 
permanently anonymize it. "Safely destroy" means we use secure methods so that the 
information cannot be recovered or read (for example, secure deletion of digital 
records). Anonymizing means we may convert your data into a form that cannot identify 
you (for instance, keeping aggregated usage statistics with personal identifiers 
removed). 
</Text>

<Text style={styles.paragraph}>
We are committed to minimal data collection and only ask for information that is truly 
needed to provide our services. For caregivers, this includes necessary qualification and 
identity verification documents to ensure safety and compliance. We do not collect 
certain sensitive details that aren't necessary – for instance, we won't ask for specific 
medical diagnoses or full health records about a care recipient. IMPORTANT: Users are 
explicitly advised not to input unnecessary medical diagnoses, detailed health 
information, or other sensitive personal data into any field, message, or section of the 
platform. You should limit the information you share to what is strictly required for care 
arrangements (such as general mobility needs or basic assistance requirements) rather 
than specific medical conditions or diagnoses. By focusing on just the essential 
information (e.g., "needs help with mobility" rather than detailed medical history or 
specific diagnosed conditions), we respect your privacy and avoid over-collection. 
</Text>

<Text style={styles.paragraph}>
We do not sell your personal information to anyone. Any changes to this policy will be 
communicated through updates to our Privacy Policy on our website. 
</Text>

<Text style={styles.sectionTitle}>Cross-Border Data Transfers</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• When providing our services, we store and process your personal information in Canada and the United States through our service providers. Our primary data storage is through Google Cloud's Canadian data centers, while several of our third-party service providers process data in the United States as detailed below:</Text>
<Text style={styles.bullet}>• Google Cloud: Some core application data stored in Canadian data centers</Text>
<Text style={styles.bullet}>• Canada-Based Data Processing</Text>
<Text style={styles.bullet}>• Segment: Data aggregation and routing happens in the U.S.</Text>
<Text style={styles.bullet}>• HubSpot: User data processed in the U.S. with global CDN</Text>
<Text style={styles.bullet}>• Intercom: Support interaction data processed in the U.S.</Text>
<Text style={styles.bullet}>• Customer.io: Email, names, and behavior logs stored on AWS Oregon servers</Text>
<Text style={styles.bullet}>• Mixpanel: Behavioral analytics data stored in the U.S.</Text>
<Text style={styles.bullet}>• Google Analytics/Firebase: Usage and authentication data processed in U.S. data centers</Text>
<Text style={styles.bullet}>• Stripe (Payments): Financial information processed globally with primary operations in the U.S.</Text>
<Text style={styles.bullet}>• Persona (Identity Verification): Biometric and ID data, caregiver credential documents processed in the U.S. on AWS servers. After verification through Persona, Amicare accesses and stores caregiver documentation in HubSpot for ongoing compliance monitoring and tracking of document expiration dates</Text>
</View>


<Text style={styles.paragraph}>
U.S.-Based Data Processing: 
</Text>

<Text style={styles.paragraph}>
We comply with all applicable laws when transferring your information across borders. 
All our service providers maintain rigorous security standards, including:
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• Data Protection Measures: We implement encryption for data in transit and at rest, and enforce strong security policies through data protection agreements with all providers</Text>
<Text style={styles.bullet}>• International Standards: Many providers comply with GDPR requirements where applicable</Text>
<Text style={styles.bullet}>• Operational Security: Persona, Customer.io, Intercom, HubSpot, and our cloud providers maintain SOC 2 certification</Text>
<Text style={styles.bullet}>• Payment Security: Stripe maintains PCI DSS compliance for secure handling of financial data</Text>
</View>

<Text style={styles.paragraph}>
You should know that privacy laws in other countries might be different from Canadian 
laws and might not provide the same level of protection. When your information is 
processed in the United States, it may be subject to U.S. laws and accessible to U.S. 
courts, law enforcement, or national security authorities under applicable laws. By using 
our services, you explicitly consent to the transfer, storage, and processing of your 
personal information in Canada and the United States as described in this section. You 
acknowledge that your personal data will be subject to U.S. laws and may be accessible 
to U.S. authorities under applicable laws. If you have concerns about cross-border data 
transfers, please contact our Privacy Officer.
</Text>

<Text style={styles.sectionTitle}>Accuracy</Text>

<Text style={styles.paragraph}>
We understand how important it is to keep your information accurate. You can update 
or correct your personal information at any time. You can review and update your 
information through your account settings or by contacting our support team.
</Text>

<Text style={styles.paragraph}>
To update your information, log in to your account and go to account settings. If you 
can't do this online or don't have an account, contact our support team at 
info@amicare.io, and we'll help you make the necessary changes. 
</Text>

<Text style={styles.paragraph}>
Please keep your information accurate and up-to-date. We rely on you to tell us about 
any changes so our records stay current.
</Text>

<Text style={styles.sectionTitle}>Safeguards</Text>


<Text style={styles.paragraph}>
To protect your personal information, we use a comprehensive set of security 
measures. These are designed to prevent unauthorized access, disclosure, and misuse 
of your information. Our safeguards include: 
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• Encryption to secure your sensitive information both when it's being transmitted and when it's stored.</Text>
<Text style={styles.bullet}>• Strict access controls, so only authorized staff can access your information when necessary for their job.</Text>
<Text style={styles.bullet}>• Regular security checks to find and fix any potential weaknesses in our systems.</Text>
<Text style={styles.bullet}>• Training for all employees about how to protect your information.</Text>
<Text style={styles.bullet}>• Physical security at our facilities to prevent unauthorized access to areas where information is stored.</Text>
<Text style={styles.bullet}>• Plans to quickly respond to any security incidents, minimizing any impact on your information.</Text>
</View>

<Text style={styles.paragraph}>
We continuously review and update our security measures to address new threats and 
challenges, ensuring your information stays secure at all times. However, please note 
that no method of transmitting or storing data is completely foolproof, so while we 
strive to protect your information, we cannot guarantee absolute security. In the unlikely 
event of a security breach, we will take prompt action to mitigate it and notify affected 
users as required by law. 
</Text>

<Text style={styles.paragraph}>
For certain functions, we rely on industry-leading providers – for example, Stripe 
processes payment information in compliance with rigorous security standards 
(PCI-DSS), and Persona uses strong encryption for identity verification – thereby adding 
extra layers of protection for your data. 
</Text>

<Text style={styles.sectionTitle}>Openness</Text>

<Text style={styles.paragraph}>
We're committed to being clear and transparent about our privacy practices. This policy 
explains what personal information we collect, how we use it, how we protect it, and 
what rights you have regarding your information. You can always find the latest version 
of this Privacy Policy on our website and within the Amicare app.
</Text>

<Text style={styles.paragraph}>
If you have questions or concerns about our privacy practices, please contact us 
through the channels provided on our website. We're here to answer your questions and 
ensure your privacy rights are respected. 
</Text>

<Text style={styles.sectionTitle}>Individual Access and Correction </Text>

<Text style={styles.paragraph}>
We recognize how important your privacy is and the personal nature of the information 
you've shared with us. We're committed to giving you access to your personal 
information and the ability to correct it.
</Text>

<Text style={styles.paragraph}>
You have the right to request a copy of your personal information that we have. To 
submit an access request:
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• Email our Privacy Officer at privacy@amicare.com</Text>
<Text style={styles.bullet}>• Include your full name, account email, and specify what information you're requesting</Text>
<Text style={styles.bullet}>• Provide proof of identity (we may request additional verification)</Text>
</View>

<Text style={styles.paragraph}>
We'll respond to your request within 30 days. If we need more time, we'll notify you in 
writing and may extend the response period by an additional 30 days as permitted by 
law. 
</Text>

<Text style={styles.paragraph}>
If you find any of your information is wrong, incomplete, or outdated, you can ask us to 
correct or update it. Send your request to our Privacy Officer with any supporting 
documentation. We'll review your request and make necessary corrections as soon as 
possible. 
</Text>

<Text style={styles.paragraph}>
We may charge a reasonable fee for processing access requests where allowed by law. 
We'll tell you about any fees before processing your request.
</Text>

<Text style={styles.paragraph}>
For questions about accessing or correcting your information, please contact our 
Privacy Officer. 
</Text>

<Text style={styles.sectionTitle}>Challenging Compliance</Text>

<Text style={styles.paragraph}>
This Privacy Policy explains how you can challenge us if you believe we're not following 
our privacy principles. If you have concerns, we encourage you to contact us directly 
through our Privacy Officer at privacy@amicare.com. 
</Text>

<Text style={styles.paragraph}>
We're committed to resolving any complaints about how we collect or use your personal 
information. Our complaints process follows these steps:  
</Text>

<Text style={styles.paragraph}>
1. Initial Contact: Submit your privacy concern to our Privacy Officer with details about your complaint.
</Text>
<Text style={styles.paragraph}>
2. Acknowledgment: We'll acknowledge receipt of your complaint within 5 business days.
</Text>
<Text style={styles.paragraph}>
3. Investigation: Our Privacy Officer will investigate your concerns and review relevant information.
</Text>
<Text style={styles.paragraph}>
4. Resolution: We'll work to resolve your complaint and provide a response within 30 days.
</Text>
<Text style={styles.paragraph}>
5. Appeal: If you're not satisfied with our response, you can request an internal review by our senior management who will review your concern within 10 business days.
</Text>

<Text style={styles.paragraph}>
If you remain unsatisfied after this internal review, you have the right to contact the 
Office of the Privacy Commissioner of Canada (OPC) to further pursue your complaint. 
The OPC can be reached through their website at www.priv.gc.ca, by phone at 
1-800-282-1376, or by mail at 30 Victoria Street, Gatineau, Quebec, K1A 1H3. You may 
also have the right to approach other regulatory bodies or privacy commissioners in 
your province. 
</Text>

<Text style={styles.sectionTitle}>Cookies, Tracking, and Analytics</Text>

<Text style={styles.paragraph}>
This section explains how we use cookies, tracking technologies, and analytics tools on 
our website and mobile app. While our mobile app does not use cookies, it does utilize 
analytics tools like Firebase and Mixpanel to understand app usage. Our website uses 
cookies and similar technologies to improve your experience, understand site usage, 
personalize content, and support our marketing efforts. By using our website, you agree 
to our use of these technologies. 
</Text>
<Text style={styles.paragraph}>
Cookies are small files placed on your device that help us remember your preferences 
and collect information about how you interact with our website. We use different types 
of cookies: 
</Text>

<View style={styles.bullets}>
<Text style={styles.bullet}>• Essential cookies that enable core site features</Text>
<Text style={styles.bullet}>• Analytics cookies that collect usage data (such as which pages are visited and for how long)</Text>
</View>

<Text style={styles.paragraph}>
We use various tracking technologies across our platforms. On our website, we use web 
beacons and pixels to collect browsing data and support marketing efforts. Our 
analytics are provided by third-party services including Google Analytics, Firebase (for 
mobile app analytics), Mixpanel (for user behavior tracking), and Twilio Segment (for 
data integration). We use Google Analytics to collect and analyze information about 
how users interact with our services. To learn how Google collects and processes data, 
please review the information at 'How Google uses information from sites or apps that 
use our services,' available at www.google.com/policies/privacy/partners/. You can 
prevent your data from being used by Google Analytics by installing the Google 
Analytics Opt-out Browser Add-on, available at 
https://tools.google.com/dlpage/gaoptout. Each of these services sets their own 
cookies on our website and collects usage information according to their own privacy 
policies, which we encourage you to review. While we configure these tools to minimize 
data collection, they help us understand how users interact with our services and enable 
us to improve our marketing effectiveness. For our mobile app, we use Firebase and 
Mixpanel for analytics without cookie-based tracking.
</Text>

</ScrollView>
</View>
</View>
</Modal>
);
}

// Default export for backwards compatibility
export default PrivacyPolicyLink;

const styles = StyleSheet.create({
container: {
flex: 1,
paddingHorizontal: 20,
paddingTop: 60,
},
header: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: 20,
},
headerTitle: {
fontSize: 24,
fontWeight: 'bold',
},
closeText: {
color: '#007AFF',
fontSize: 18,
},
contentContainer: {
paddingBottom: 100,
},
sectionTitle: {
fontSize: 18,
fontWeight: 'bold',
marginTop: 24,
marginBottom: 10,
},
paragraph: {
fontSize: 14,
lineHeight: 22,
marginBottom: 14,
},
bullets: {
marginLeft: 12,
marginBottom: 14,
},
bullet: {
fontSize: 14,
lineHeight: 22,
marginBottom: 4,
},
});