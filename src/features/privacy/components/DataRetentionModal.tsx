import React from 'react';
import {
View,
Text,
Modal,
ScrollView,
TouchableOpacity,
StyleSheet,
} from 'react-native';

interface DataRetentionLinkProps {
textStyle?: any;
onPress: () => void;
}

interface DataRetentionModalProps {
visible: boolean;
onClose: () => void;
}

// Clickable Data Retention link component
export function DataRetentionLink({ textStyle, onPress }: DataRetentionLinkProps) {
return (
<Text style={[{ color: '#0c7ae2' }, textStyle]} onPress={onPress}>
Data Retention
</Text>
);
}

// Data Retention modal component
export function DataRetentionModal({ visible, onClose }: DataRetentionModalProps) {
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
<Text style={styles.headerTitle}>Data Retention</Text>
<TouchableOpacity onPress={onClose}>
<Text style={styles.closeText}>Close</Text>
</TouchableOpacity>
</View>

<ScrollView contentContainerStyle={styles.contentContainer}>


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
• Persona (Identity Verification): Processes government-issued ID documents, captures biometric information (such as facial geometry from your selfie), and performs identity verification for both caregivers and care seekers. For caregivers, Persona also processes all qualification documents including driver's license, driver's license abstract, criminal record check with vulnerable sector screening, certifications, and other credentials for initial verification. They receive your ID documents, biometric information, qualification documents, and basic personal information to verify your identity and credentials. In accordance with our provider's policies, biometric identifiers collected during verification are securely and permanently destroyed within three years of your last interaction with the verification service. Amicare receives verification results, reviews all caregiver documentation, and maintains ongoing access to these documents for compliance monitoring. Persona is SOC 2 and GDPR-compliant but processes data in the United States on AWS servers.
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

</ScrollView>
</View>
</View>
</Modal>
);
}

// Default export for backwards compatibility
export default DataRetentionLink;

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
