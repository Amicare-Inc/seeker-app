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
In this Privacy Policy, <Text style={{ fontWeight: 'bold' }}>"Amicare," "we," "us," and "our"</Text> refer to Amicare Inc., located at [Address].
<Text style={{ fontWeight: 'bold' }}>"Amicare"</Text> is a mobile marketplace platform that connects individuals seeking caregiving services (<Text style={{ fontWeight: 'bold' }}>"care seekers"</Text>)
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

<Text style={styles.sectionTitle}>Children's Privacy</Text>

<Text style={styles.paragraph}>
Amicare's platform and services are not intended for use by individuals under 18 years 
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
<Text style={styles.bullet}>• Phone: 3439973997</Text>
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

{/* Continue with rest of content - abbreviated here for space */}

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