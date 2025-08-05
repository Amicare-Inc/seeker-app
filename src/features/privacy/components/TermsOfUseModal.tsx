import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface TermsOfUseLinkProps {
  textStyle?: any;
  onPress: () => void;
}

interface TermsOfUseModalProps {
  visible: boolean;
  onClose: () => void;
}

// Clickable Terms of Use link component
export function TermsOfUseLink({ textStyle, onPress }: TermsOfUseLinkProps) {
  return (
    <Text style={[{ color: '#0c7ae2' }, textStyle]} onPress={onPress}>
      Terms of Use
    </Text>
  );
}

// Terms of Use modal component
export function TermsOfUseModal({ visible, onClose }: TermsOfUseModalProps) {
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
            <Text style={styles.headerTitle}>Terms of Use</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.contentContainer}>

            <Text style={styles.effectiveDate}>
              Effective Date: July 29, 2025
            </Text>
            <Text style={styles.effectiveDate}>
              Last Updated: July 29, 2025
            </Text>

            <Text style={styles.sectionTitle}>1. Welcome to Amicare: Introduction and Your Agreement</Text>

            <Text style={styles.subSectionTitle}>1.1 Our Agreement</Text>
            <Text style={styles.paragraph}>
              Welcome to Amicare. These Terms of Use (which we'll call the <Text style={{ fontWeight: 'bold' }}>"Terms"</Text>) are a legally binding 
              contract between you (<Text style={{ fontWeight: 'bold' }}>"you," "your", "User"</Text>) and Amicare Inc. (<Text style={{ fontWeight: 'bold' }}>"Amicare," "we," "us," "our"</Text>). 
              We are a company located at 18 King Street East, Suite 1400 Toronto, ON M5C 1C4, Canada, 
              and these Terms are here to outline the rules and responsibilities for everyone in our 
              community.
            </Text>

            <Text style={styles.subSectionTitle}>1.2 What These Terms Cover</Text>
            <Text style={styles.paragraph}>
              These Terms govern your access to and use of the Amicare mobile application (<Text style={{ fontWeight: 'bold' }}>"App"</Text>), our 
              website, and all related services we offer (collectively, the <Text style={{ fontWeight: 'bold' }}>"Platform"</Text>). Our goal is to provide a 
              trusted marketplace that connects individuals seeking caregiving services with professional 
              caregivers.
            </Text>

            <Text style={styles.subSectionTitle}>1.3 Accepting These Terms</Text>
            <Text style={styles.paragraph}>
              By creating an account, accessing, or using our Platform, you are confirming that you have 
              read, understood, and agree to be bound by these Terms and our Privacy Policy. Our Privacy 
              Policy is a core part of our agreement with you and explains in detail how we collect, use, and 
              protect your personal information. You can review it anytime, and we encourage you to do so. 
              Your formal agreement to both documents happens when you create your account, which 
              requires your clear, affirmative consent, such as by checking an unchecked box.
            </Text>

            <Text style={styles.paragraph}>
              This approach ensures that the legal foundation of our relationship is clear from the start. A 
              traditional, dense legal document can be intimidating, so we've structured these Terms to first 
              welcome you, explain their purpose in plain language, and then clearly state the legal effect of 
              your acceptance. This reflects our commitment to transparency and building a relationship 
              based on trust.
            </Text>

            <Text style={styles.sectionTitle}>2. Understanding Our Language: Key Definitions</Text>

            <Text style={styles.paragraph}>
              To make sure we're all on the same page, here are some key terms we use throughout this 
              document. We believe clear definitions are essential for a transparent and fair platform.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Amicare, we, us, our:</Text> Refers to Amicare Inc., the company that provides the Platform.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>App:</Text> Refers to the Amicare mobile application.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Booking:</Text> A confirmed arrangement for a Care Session made through the Platform between a 
              Care Seeker and a Caregiver.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Care Recipient:</Text> The person receiving care services. This may be the Care Seeker themselves 
              or another person, such as a family member, for whom the Care Seeker is arranging care.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Care Seeker:</Text> An individual who uses the Amicare Platform to find, book, and manage 
              caregiving services for themselves or for a Care Recipient.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Care Session:</Text> The specific period of time during which a Caregiver provides services to a 
              Care Recipient as arranged through a Booking.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Caregiver:</Text> An independent, third-party professional who uses the Amicare Platform to offer 
              their caregiving services directly to Care Seekers. Caregivers on our platform may include 
              Personal Support Workers (PSWs) and other qualified individuals.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Personal Information:</Text> Information about an identifiable individual, as defined and detailed 
              in our Privacy Policy.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Platform:</Text> Refers to the Amicare App, our website, and all related services we provide to 
              connect our community.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Services:</Text> The full range of services provided by Amicare through the Platform, including 
              facilitating connections, bookings, communications, and payments between Users.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>Third-Party Services:</Text> Independent services that we integrate with our Platform to provide 
              core functions, such as Persona for identity verification and Stripe for payment processing.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>User:</Text> Any individual who accesses or uses the Amicare Platform, whether as a Care Seeker, 
              Caregiver, or visitor.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>User Account:</Text> The personal account a User creates to access and use the Platform's 
              features.
            </Text>

            <Text style={styles.paragraph}>
              <Text style={{ fontWeight: 'bold' }}>User Content:</Text> Any content that a User creates, posts, or shares on the Platform, such as 
              profile information, photos, bios, and ratings.
            </Text>

            <Text style={styles.paragraph}>
              Establishing these definitions upfront is a crucial part of our commitment to clarity. For 
              instance, defining a "Caregiver" as an "independent, third-party professional" from the very 
              beginning is fundamental. It ensures that every time the term is used, it carries this specific 
              meaning, helping you understand the distinct roles within our community and reinforcing the 
              marketplace model that gives you choice and control.
            </Text>

            <Text style={styles.sectionTitle}>3. The Amicare Platform: What We Do (and What We Don't Do)</Text>

            <Text style={styles.paragraph}>
              This section is one of the most important in our Terms because it clearly explains our role. We 
              believe managing your expectations is key to a positive and trustworthy relationship.
            </Text>

            <Text style={styles.subSectionTitle}>3.1 Our Role as a Marketplace</Text>
            <Text style={styles.paragraph}>
              Amicare provides a technology platform that serves as a marketplace. Our purpose is to enable 
              Care Seekers to connect with independent Caregivers to arrange and schedule care services. 
              We build and maintain the tools that facilitate communication, booking management, and 
              secure payment processing between Users.
            </Text>

            <Text style={styles.subSectionTitle}>3.2 We Connect, We Don't Employ or Provide Care</Text>
            <Text style={styles.paragraph}>
              To maintain a platform that offers choice and flexibility, it's essential to understand the limits of 
              our role. This is what Amicare is not and what we do not do:
            </Text>

            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                • Amicare does not employ Caregivers. Caregivers are independent professionals and 
                business owners who use our Platform to offer their services directly to Care Seekers. 
                They are not our employees, partners, or agents.
              </Text>
              <Text style={styles.bullet}>
                • Amicare does not provide or supervise care services. We are not a healthcare provider, 
                home care agency, or employment agency. The care itself is provided by the Caregiver, 
                under the direction of the Care Seeker or Care Recipient.
              </Text>
              <Text style={styles.bullet}>
                • Amicare is not a party to your service agreement. When a Care Seeker books a Care 
                Session with a Caregiver, they form a direct contract with each other. Amicare is not part 
                of that agreement. Our role is strictly limited to being a neutral facilitator and, for 
                financial transactions, acting as a payment agent for the Caregiver to process payments 
                on their behalf.
              </Text>
            </View>

            <Text style={styles.paragraph}>
              This distinction is the foundation of our business model. It is what allows us to provide a 
              platform where Care Seekers have the freedom to choose the professional who best fits their 
              needs, and Caregivers have the autonomy to operate their own business on their own terms. 
              Understanding this model is key to using Amicare effectively.
            </Text>

            <Text style={styles.subSectionTitle}>3.3 Your Relationship with Other Users</Text>
            <Text style={styles.paragraph}>
              Because we are a marketplace, we do not guarantee the quality, suitability, reliability, or safety 
              of the services provided by any Caregiver, nor do we guarantee the conduct of any Care Seeker. 
              We take steps to build a trusted community, such as our mandatory identity verification 
              process, but your interactions with other Users are ultimately at your own risk.
            </Text>

            <Text style={styles.sectionTitle}>4. Using Amicare: Your Account</Text>

            <Text style={styles.paragraph}>
              Your User Account is your gateway to the Amicare community. Here's what you need to know 
              about creating and managing your account.
            </Text>

            <Text style={styles.subSectionTitle}>4.1 Who Can Use Amicare (Eligibility)</Text>
            <Text style={styles.paragraph}>
              To create an account and use the Amicare Platform, you must be at least 18 years of age and 
              have the legal capacity to enter into a binding contract. Our services are not intended for use by 
              individuals under 18, and we do not knowingly collect their Personal Information. If you are 
              under 18, a parent or legal guardian must create an account and arrange services on your 
              behalf.
            </Text>

            <Text style={styles.subSectionTitle}>4.2 Creating Your Account</Text>
            <Text style={styles.paragraph}>
              When you register for an account, you agree to provide information that is accurate, current, 
              and complete, and to keep this information updated. Providing accurate information is 
              essential for our platform to work effectively, from matching you with other users to processing 
              payments. To ensure the integrity of our community, each User is permitted to create and 
              maintain only one User Account.
            </Text>

            <Text style={styles.subSectionTitle}>4.3 Keeping Your Account Secure</Text>
            <Text style={styles.paragraph}>
              You are responsible for maintaining the confidentiality of your account login credentials (your 
              email and password) and for all activities that occur under your account. We encourage you to 
              use a strong, unique password. If you suspect any unauthorized use of your account or any 
              other breach of security, you must notify us immediately so we can take appropriate action.
            </Text>

            <Text style={styles.subSectionTitle}>4.4 User Verification and Platform Safety Disclaimers</Text>
            <Text style={styles.paragraph}>
              Building a safe and trusted community is our top priority. To achieve this, we require all Users 
              (both Care Seekers and Caregivers) to complete a mandatory identity verification (IDV) process 
              as a condition of using the Platform.
            </Text>

            <Text style={styles.paragraph}>
              This requirement is not a hurdle; it is a core feature of our commitment to your safety. By 
              verifying that everyone is who they say they are, we create a more secure environment for all 
              members of our community. A Care Seeker can have greater peace of mind knowing the person 
              entering their home has been verified, and a Caregiver can feel more secure knowing the 
              person they are working for is legitimate.
            </Text>

            <Text style={styles.paragraph}>
              Our verification process is designed to verify a User's identity by comparing a 
              government-issued ID to a biometric selfie. This process is an important step in building a 
              trusted community. However, Users must understand that this identity verification is not a 
              comprehensive background check. It does not include a review of criminal records, vulnerable 
              sector screening, professional certifications, reference checks, or any assessment of a User's 
              character, past conduct, or suitability to provide or receive care. Amicare does not endorse any 
              User and does not guarantee their conduct or the quality of their services.
            </Text>

            <Text style={styles.paragraph}>
              While Amicare takes steps to foster a trusted community, we do not independently verify all 
              information provided by Users and assume no responsibility for the accuracy or reliability of 
              identity verification or any other information provided by Users through the Platform. Your 
              interactions with other Users are solely at your own risk. Amicare expressly disclaims any and 
              all liability for any acts or omissions of Users, both on and off the Platform.
            </Text>

            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>How it Works:</Text> We partner with a trusted, specialized third-party service, Persona, to 
                conduct this verification. The process may require you to provide images of your 
                government-issued ID and a selfie for biometric comparison.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Purpose:</Text> We require IDV to enhance platform safety, help prevent fraud, deter bad 
                actors, and verify that Users meet our age requirements.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Your Agreement with Persona:</Text> When you undergo verification, you will be subject to 
                Persona's own Terms of Service and Privacy Policy. We encourage you to review them.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Consequences:</Text> Failure to participate in or successfully complete the IDV process will 
                result in the temporary suspension of marketplace access and interaction privileges until 
                the verification process is completed.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Your Privacy:</Text> For detailed information on how your identity verification data is collected, 
                used, and protected, please see our Privacy Policy.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>5. Terms for All Users</Text>

            <Text style={styles.paragraph}>
              The Amicare community is built on a foundation of mutual respect and trust. The following 
              rules apply to everyone on the Platform.
            </Text>

            <Text style={styles.subSectionTitle}>5.1 Our Community Code of Conduct</Text>
            <Text style={styles.paragraph}>
              By using Amicare, you agree to interact with other Users and our team in a respectful, 
              professional, and lawful manner at all times. You agree that you will not engage in any of the 
              following prohibited behaviors:
            </Text>

            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                • Harassment, abuse, discrimination, or any form of disrespectful or threatening conduct.
              </Text>
              <Text style={styles.bullet}>
                • Any illegal activities or the facilitation of such activities.
              </Text>
              <Text style={styles.bullet}>
                • Fraudulent activities, including misrepresenting your identity, qualifications, or any other 
                information.
              </Text>
              <Text style={styles.bullet}>
                • Using the Platform for any purpose other than arranging or providing care services as 
                intended.
              </Text>
              <Text style={styles.bullet}>
                • Sharing another User's personal information without their explicit consent or for any 
                purpose outside of a confirmed Care Session.
              </Text>
              <Text style={styles.bullet}>
                • Violating any safety guidelines or professional boundaries.
              </Text>
            </View>

            <Text style={styles.paragraph}>
              Violating this Code of Conduct can have serious consequences. Depending on the severity of 
              the violation, we reserve the right to issue warnings, suspend your account, or permanently 
              terminate your access to the Platform, at our sole discretion.
            </Text>

            <Text style={styles.subSectionTitle}>5.2 Your Content on Amicare (Profiles, Ratings, and Messages)</Text>
            <Text style={styles.paragraph}>
              You are responsible for the User Content you post on the Platform, which includes your profile 
              information, photos, bios, messages, and ratings.
            </Text>

            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Ownership and License:</Text> You retain ownership of your original User Content. However, 
                by posting it on the Platform, you grant Amicare a worldwide, non-exclusive, royalty-free, 
                transferable license to use, display, reproduce, and distribute that content in connection 
                with operating, promoting, and improving our Services. For example, we need this 
                license to display your profile to other Users or to show your rating on a Caregiver's 
                profile.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Ratings:</Text> We believe in accountability and informed decision-making. Care Seekers can 
                leave star ratings for Caregivers after a completed Care Session. All ratings must be 
                truthful, based on your direct experience, fair, and respectful. We reserve the right to 
                monitor and remove any content that violates our Terms or Code of Conduct. To maintain 
                a focus on professional accountability and to ensure Care Seekers feel comfortable 
                sharing their needs, only Caregivers are rated on the Amicare platform.
              </Text>
            </View>

            <Text style={styles.subSectionTitle}>5.3 Our Intellectual Property and Your License to Use the Platform</Text>
            <Text style={styles.paragraph}>
              The Platform – including our App, website, logos, trademarks, software, and all other 
              proprietary content and technology – is owned by Amicare Inc. and is protected by intellectual 
              property laws.
            </Text>

            <Text style={styles.paragraph}>
              We grant you a limited, non-exclusive, non-transferable, and revocable license to access and 
              use the Platform for its intended purpose, as outlined in these Terms, for as long as your 
              account remains in good standing. You may not copy, modify, distribute, sell, or lease any part 
              of our Platform or software.
            </Text>

            <Text style={styles.subSectionTitle}>5.4 Feedback You Provide</Text>
            <Text style={styles.paragraph}>
              We welcome your feedback and suggestions for improving Amicare. If you choose to provide us 
              with ideas or feedback, you agree that we are free to use them without any restriction or 
              compensation to you.
            </Text>

            <Text style={styles.sectionTitle}>6. Terms for Care Seekers</Text>

            <Text style={styles.paragraph}>
              If you use Amicare to find and book care for yourself or a Care Recipient, the following terms 
              apply specifically to you.
            </Text>

            <Text style={styles.subSectionTitle}>6.1 Your Responsibilities as a Care Seeker</Text>
            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Accurate Information:</Text> You are responsible for providing accurate, complete, and 
                up-to-date information about your care needs, the Care Recipient, and any relevant 
                household conditions (such as the presence of pets, stairs, or potential hazards). This 
                information is crucial for finding a suitable Caregiver and ensuring a safe and effective 
                Care Session.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Safe Environment:</Text> If care is provided in your home, you are responsible for providing a 
                safe, clean, and appropriate environment for the Caregiver to perform their services.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Respectful Conduct:</Text> You must treat Caregivers with dignity and respect at all times, in 
                accordance with our Community Code of Conduct.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Supervision and Direction:</Text> You acknowledge that you or the Care Recipient are 
                responsible for directing and supervising the Caregiver regarding the specific tasks and 
                preferences during a Care Session, within the scope of the agreed-upon Booking.
              </Text>
            </View>

            <Text style={styles.subSectionTitle}>6.2 Booking a Care Session</Text>
            <Text style={styles.paragraph}>
              Our Platform guides you through the process of creating and submitting a request for a Care 
              Session. This includes specifying the date, time, location, and the specific tasks and care needs 
              required for the session.
            </Text>

            <Text style={styles.subSectionTitle}>6.3 Payments, Fees, and Authorizations</Text>
            <Text style={styles.paragraph}>
              When you book a Care Session, you authorize Amicare, acting as the designated payment 
              collection agent for your Caregiver, to charge your chosen payment method for the total fees 
              associated with that session. This includes the Caregiver's service fee and any applicable 
              Platform fees.
            </Text>

            <Text style={styles.sectionTitle}>7. Terms for Caregivers</Text>

            <Text style={styles.paragraph}>
              If you use Amicare to offer your professional caregiving services, the following terms apply 
              specifically to you.
            </Text>

            <Text style={styles.subSectionTitle}>7.1 Your Responsibilities as a Caregiver</Text>
            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Qualifications and Representations:</Text> You represent and warrant that you possess all the 
                qualifications, certifications (e.g., a valid PSW certificate, if claimed), skills, and 
                experience that you list on your profile. You agree to provide accurate information and to 
                keep it current at all times. You also warrant that you hold any licenses or registrations 
                legally required to provide the services you offer.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Insurance:</Text> You represent and warrant that you have obtained and will maintain, at your 
                own expense, valid professional liability and commercial general liability insurance 
                policies with coverage limits sufficient to cover any risks, damages, or liabilities 
                associated with the services you provide. You further warrant that you will maintain any 
                statutorily required insurance, including, where applicable, workers' compensation 
                coverage (such as WSIB in Ontario). You agree to provide proof of such insurance upon 
                request.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Professional Conduct:</Text> You agree to provide your services in a professional, ethical, 
                compassionate, and competent manner, adhering to generally accepted standards of 
                care and our Community Code of Conduct.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Honouring Commitments:</Text> You are responsible for maintaining your accurate availability 
                on the Platform and for honouring all confirmed Bookings you accept.
              </Text>
            </View>

            <Text style={styles.subSectionTitle}>7.2 Non-Circumvention Clause</Text>
            <Text style={styles.paragraph}>
              To maintain the integrity and sustainability of the Amicare Platform, Caregivers agree not to 
              directly or indirectly initiate contact, solicit, or engage with any Care Seekers or Care Recipients 
              introduced or identified through the Platform for the purpose of arranging or providing care 
              services outside the Platform. This prohibition applies while the Caregiver's account is active 
              and extends for a period of six (6) months following the termination of their account. Any 
              breach of this non-circumvention obligation may result in account suspension, termination, 
              and/or legal action to recover damages or other remedies available under the law.
            </Text>

            <Text style={styles.paragraph}>
              Caregivers acknowledge that this clause is essential to protect the business interests of 
              Amicare and ensure fair competition within the Platform's ecosystem. This clause, however, 
              does not restrict Caregivers from engaging with individuals they were acquainted with prior to 
              joining the Platform or from providing services to individuals not identified through the 
              Platform.
            </Text>

            <Text style={styles.subSectionTitle}>7.3 Your Independent Contractor Status (A Critical Distinction)</Text>
            <Text style={styles.paragraph}>
              This is a critical part of our agreement. By using the Platform, you explicitly acknowledge and 
              agree to the following:
            </Text>

            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>You are an Independent Contractor:</Text> You are an independent business owner, not an 
                employee, partner, joint venturer, or agent of Amicare. You have complete discretion over 
                when, where, and how often you offer your services through the Platform.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>You are Responsible for Your Own Business:</Text> As an independent contractor, you are 
                solely responsible for all aspects of your business, including:
              </Text>
            </View>

            <View style={[styles.bullets, { marginLeft: 24 }]}>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Taxes:</Text> Paying your own income taxes, HST/GST, and any other applicable taxes. 
                Amicare does not withhold any taxes on your behalf.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Insurance:</Text> Obtaining and maintaining your own insurance, including professional 
                liability insurance and any required workers' compensation coverage (e.g., WSIB in 
                Ontario).
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Compliance:</Text> Complying with all applicable laws and regulations related to your 
                provision of services.
              </Text>
            </View>

            <Text style={styles.subSectionTitle}>7.4 Managing Your Profile and Bookings</Text>
            <Text style={styles.paragraph}>
              The Platform allows you to manage your professional profile, set your own hourly rates, and 
              define your availability. You will receive notifications for booking requests from Care Seekers, 
              which you can review, accept, or decline based on your professional judgment and availability.
            </Text>

            <Text style={styles.subSectionTitle}>7.5 Receiving Payments for Your Services</Text>
            <Text style={styles.paragraph}>
              To receive payments for your completed Care Sessions, you are required to create and 
              maintain an account with our third-party payment processor, Stripe, through their Stripe 
              Connect service.
            </Text>

            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Stripe Connected Account:</Text> You must agree to the Stripe Connected Account Agreement 
                and any other applicable Stripe terms. This is necessary for us to facilitate payouts to 
                your bank account.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Your Role:</Text> Using Stripe Connect reinforces your status as an independent business. It 
                means you are responsible for providing and maintaining your own accurate bank 
                account information and for managing your financial and tax obligations directly through 
                your Stripe account. This structure is a key operational element that supports the legal 
                distinction between an independent contractor and an employee.
              </Text>
            </View>

<Text style={styles.sectionTitle}>8. Financials: Bookings, Payments, and Cancellations</Text>

            <Text style={styles.paragraph}>
              We believe in making financial matters clear and predictable. This section covers all the rules 
              related to payments, fees, and what happens if plans change.
            </Text>

            <Text style={styles.subSectionTitle}>8.1 Booking and Confirming a Care Session</Text>
            <Text style={styles.paragraph}>
              A booking request becomes a confirmed Booking only when it is mutually accepted by both the 
              Care Seeker and the Caregiver through the Platform. At that point, a binding service agreement 
              is formed directly between the Care Seeker and the Caregiver for that specific Care Session. 
              Any modifications to a confirmed Booking, such as changing the time or duration, must be 
              requested through the Platform and mutually agreed upon by both parties.
            </Text>

            <Text style={styles.subSectionTitle}>8.2 How Payments Work (Our Escrow System)</Text>
            <Text style={styles.paragraph}>
              To protect both parties, we use a secure escrow system for all payments, facilitated by our 
              payment partner, Stripe. Here's how it works in simple terms:
            </Text>

            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                1. <Text style={{ fontWeight: 'bold' }}>Payment is Secured:</Text> When a Care Seeker books a session, their payment is charged, but 
                the funds are held securely in escrow by Stripe.
              </Text>
              <Text style={styles.bullet}>
                2. <Text style={{ fontWeight: 'bold' }}>Service is Completed:</Text> The Caregiver provides the services for the completed Care 
                Session.
              </Text>
              <Text style={styles.bullet}>
                3. <Text style={{ fontWeight: 'bold' }}>Funds are Released:</Text> After the session is confirmed as complete through the App, the 
                funds are released from escrow after a 48-hour review period (the <Text style={{ fontWeight: 'bold' }}>"Review Period"</Text>) and 
                paid out to the Caregiver's Stripe account.
              </Text>
            </View>

            <Text style={styles.paragraph}>
              After a Care Session is marked as complete by the Caregiver, the Care Seeker will have the 
              duration of the Review Period to report any significant, good-faith issues with the service 
              directly through the Platform's dispute resolution feature. If no issue is reported by the Care 
              Seeker within this 48-hour period, the funds held in escrow will be automatically released to 
              the Caregiver's Stripe account. If a payment-related dispute is formally initiated within the 
              Review Period, the funds will remain in escrow pending resolution as described in the 
              "Resolving Issues Between Users" section.
            </Text>

            <Text style={styles.paragraph}>
              This system provides peace of mind for everyone. Care Seekers are assured they only pay for 
              services that are rendered, and Caregivers are assured that payment for their work is secured 
              before the session begins.
            </Text>

            <Text style={styles.subSectionTitle}>8.3 Our Service Fees</Text>
            <Text style={styles.paragraph}>
              Amicare charges a service fee to operate and continuously improve the Platform. Our fees will 
              be clearly and conspicuously disclosed to you at the time of booking or on your earnings 
              summary. We will specify how the fee is calculated (e.g., as a percentage of the booking value) 
              and whether it is charged to the Care Seeker, the Caregiver, or both.
            </Text>

            <Text style={styles.subSectionTitle}>8.4 Cancellation and Refund Policy</Text>
            <Text style={styles.paragraph}>
              We understand that plans can change. To be fair to both Care Seekers and Caregivers, we have 
              a clear and consistent cancellation policy. This policy must be followed by all Users.
            </Text>

            <Text style={styles.paragraph}>
              The following table summarizes our cancellation policy. Please review it carefully, as it will be 
              applied to all Bookings.
            </Text>

            <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 16 }]}>
              If a Care Seeker Cancels...
            </Text>

            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                <Text style={{ fontWeight: 'bold' }}>More than 24 hours before the session starts:</Text> Full Refund to Care Seeker, $0 Payment to Caregiver
              </Text>
              <Text style={styles.bullet}>
                <Text style={{ fontWeight: 'bold' }}>Between 12 and 24 hours before the session starts:</Text> 50% Refund to Care Seeker, 50% of the Session Fee to Caregiver*
              </Text>
              <Text style={styles.bullet}>
                <Text style={{ fontWeight: 'bold' }}>Less than 12 hours before the session starts (or a no-show):</Text> No Refund to Care Seeker, 75% of the Session Fee to Caregiver*
              </Text>
            </View>

            <Text style={[styles.paragraph, { fontWeight: 'bold', marginTop: 16 }]}>
              If a Caregiver Cancels...
            </Text>

            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                <Text style={{ fontWeight: 'bold' }}>At any time:</Text> Full Refund to Care Seeker. If a Caregiver cancels a confirmed Booking at 
                any time, the Care Seeker will receive a full refund of all fees paid for that Booking. The Care 
                Seeker may then use the Platform to search for and book a new Care Session with another 
                available Caregiver of their choice. The cancellation will be recorded. Repeated or 
                last-minute cancellations may impact the Caregiver's standing on the Platform and could lead 
                to account suspension.
              </Text>
            </View>

            <Text style={styles.paragraph}>
              *The payment to the Caregiver is calculated on the total session fee, from which Amicare's 
              service fee may be deducted.
            </Text>

            <Text style={styles.paragraph}>
              Any applicable non-refundable transaction fees from our payment processor may be deducted 
              from the refund amount. All cancellation and refund policies are designed to be fair and are 
              disclosed before you confirm a booking, in line with consumer protection principles.
            </Text>

            <Text style={styles.sectionTitle}>9. When Things Don't Go as Planned: Disputes and Legal Terms</Text>

            <Text style={styles.paragraph}>
              This section outlines the processes for resolving disagreements and includes important legal 
              terms that protect both you and Amicare. We have designed these clauses to be as fair and 
              clear as possible.
            </Text>

            <Text style={styles.subSectionTitle}>9.1 Resolving Issues Between Users</Text>
            <Text style={styles.paragraph}>
              Disputes may occasionally arise between Care Seekers and Caregivers regarding a Care 
              Session. Because the service agreement is directly between the two of you, you are 
              encouraged to communicate directly to resolve the issue. Amicare is not obligated to mediate 
              or adjudicate disputes related to the quality or specifics of care services provided. However, we 
              may, at our discretion, offer assistance in resolving payment-related disputes concerning the 
              release of funds from escrow.
            </Text>

            <Text style={styles.subSectionTitle}>9.2 Dispute Resolution with Amicare (Our Step-by-Step Process)</Text>
            <Text style={styles.paragraph}>
              If you have a dispute with Amicare, we are committed to a resolution process that is fair, 
              accessible, and efficient. Our process is designed with Canadian legal standards in mind, 
              particularly to ensure it is not prohibitively expensive or difficult for an individual to access.
            </Text>

            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                1. <Text style={{ fontWeight: 'bold' }}>Step 1: Informal Resolution.</Text> Please contact our customer support team first. We find 
                that most disagreements can be resolved quickly and amicably this way.
              </Text>
              <Text style={styles.bullet}>
                2. <Text style={{ fontWeight: 'bold' }}>Step 2: Mediation.</Text> If we can't resolve the issue informally, we agree to first attempt to 
                resolve it through good-faith mediation with a neutral, third-party mediator before 
                resorting to more formal proceedings.
              </Text>
              <Text style={styles.bullet}>
                3. <Text style={{ fontWeight: 'bold' }}>Step 3: Binding Arbitration.</Text> If mediation does not resolve the dispute, it will be resolved 
                by final and binding arbitration. This means the dispute will be decided by a neutral 
                arbitrator, not in a court of law.
              </Text>
            </View>

            <View style={[styles.bullets, { marginLeft: 24 }]}>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Location and Rules:</Text> The arbitration will be administered by a recognized Canadian 
                arbitration body (such as the ADR Institute of Canada) and will take place in 
                Toronto, Ontario. The proceedings will be conducted in English by a single 
                arbitrator to keep the process efficient and affordable.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Accessibility:</Text> To ensure this process is accessible, Amicare will pay the 
                administrative fees required to initiate the arbitration for disputes brought by an 
                individual User.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Class Action Waiver:</Text> To the extent permitted by law, all disputes must be brought 
                on an individual basis. You agree to waive your right to participate in any class 
                action lawsuit or class-wide arbitration against Amicare.
              </Text>
            </View>

            <Text style={styles.subSectionTitle}>9.3 Disclaimers (The "As Is" Nature of Our Platform)</Text>
            <Text style={styles.paragraph}>
              To the fullest extent permitted by law, the Amicare Platform is provided on an "as is" and "as 
              available" basis. We disclaim all warranties, whether express or implied, including warranties 
              of merchantability, fitness for a particular purpose, and non-infringement.
            </Text>

            <Text style={styles.paragraph}>
              We also explicitly reiterate our disclaimer regarding care services: Amicare makes no 
              representations or warranties about the quality, safety, suitability, or conduct of any User. You 
              engage with other Users at your own risk.
            </Text>

            <Text style={styles.subSectionTitle}>9.4 Limitation of Our Liability</Text>
            <Text style={styles.paragraph}>
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, AMICARE (INCLUDING OUR 
              DIRECTORS, EMPLOYEES, AND AGENTS) SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF 
              PROFITS, DATA, OR OTHER INTANGIBLE LOSSES ARISING FROM YOUR USE OF THE 
              PLATFORM OR YOUR INTERACTIONS WITH OTHER USERS.
            </Text>

            <Text style={styles.paragraph}>
              IN ANY EVENT, AMICARE'S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO THE 
              SERVICES SHALL NOT EXCEED THE GREATER OF $100 CAD OR THE TOTAL FEES YOU PAID TO 
              AMICARE IN THE SIX (6) MONTHS PRIOR TO THE EVENT GIVING RISE TO THE CLAIM.
            </Text>

            <Text style={styles.paragraph}>
              Please note that some jurisdictions, including Ontario, do not allow the exclusion of certain 
              warranties or the limitation of liability for certain damages. Accordingly, some of the limitations 
              above may not apply to you, and you may have additional rights.
            </Text>

            <Text style={styles.subSectionTitle}>9.5 Release of Liability for Interactions and Care-Related Incidents</Text>
            <Text style={styles.paragraph}>
              BECAUSE AMICARE IS A MARKETPLACE PLATFORM AND NOT A CARE PROVIDER OR 
              EMPLOYER, YOU AGREE THAT ANY LEGAL REMEDY OR LIABILITY THAT YOU SEEK TO OBTAIN 
              FOR ACTIONS OR OMISSIONS OF OTHER USERS OR THIRD PARTIES WILL BE LIMITED TO A 
              CLAIM AGAINST THE PARTICULAR USER OR OTHER THIRD PARTY WHO CAUSED YOU HARM. 
              YOU AGREE NOT TO ATTEMPT TO IMPOSE LIABILITY ON OR SEEK ANY LEGAL REMEDY FROM 
              AMICARE WITH RESPECT TO SUCH ACTIONS OR OMISSIONS.
            </Text>

            <Text style={styles.paragraph}>
              YOU ACKNOWLEDGE THAT YOU ARE SOLELY RESPONSIBLE FOR YOUR INTERACTIONS WITH 
              OTHER USERS AND FOR MAKING YOUR OWN ASSESSMENT OF THE SUITABILITY OF ANY 
              CAREGIVER OR CARE SEEKER. WE ENCOURAGE YOU TO EXERCISE CAUTION AND GOOD 
              JUDGMENT IN ALL INTERACTIONS.
            </Text>

            <Text style={styles.paragraph}>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, YOU HEREBY RELEASE, AND AGREE TO 
              INDEMNIFY, DEFEND, AND HOLD HARMLESS AMICARE AND ITS AFFILIATES, OFFICERS, 
              DIRECTORS, AND EMPLOYEES FROM ANY AND ALL CLAIMS, DEMANDS, DAMAGES (ACTUAL, 
              CONSEQUENTIAL, OR OTHERWISE), LIABILITIES, AND COSTS OF EVERY KIND AND NATURE, 
              KNOWN AND UNKNOWN, ARISING OUT OF OR IN ANY WAY CONNECTED WITH: (A) DISPUTES 
              BETWEEN YOU AND OTHER USERS; (B) YOUR USE OF THE PLATFORM; AND (C) ANY SERVICES 
              PROVIDED BY A CAREGIVER OR RECEIVED BY A CARE SEEKER. THIS RELEASE INCLUDES, 
              BUT IS NOT LIMITED TO, ANY CLAIMS RELATED TO PERSONAL OR BODILY INJURY, 
              EMOTIONAL DISTRESS, PROPERTY DAMAGE, NEGLIGENCE, OR ANY OTHER HARM 
              RESULTING FROM YOUR INTERACTIONS WITH OTHER USERS.
            </Text>

            <Text style={styles.subSectionTitle}>9.6 Your Agreement to Indemnify Us</Text>
            <Text style={styles.paragraph}>
              YOU AGREE TO INDEMNIFY, DEFEND, AND HOLD HARMLESS AMICARE AND ITS AFFILIATES, 
              OFFICERS, AND EMPLOYEES FROM ANY CLAIMS, LIABILITIES, DAMAGES, AND COSTS 
              (INCLUDING REASONABLE LEGAL FEES) THAT ARISE FROM YOUR USE OF THE PLATFORM, 
              YOUR VIOLATION OF THESE TERMS, YOUR VIOLATION OF ANY THIRD PARTY'S RIGHTS 
              (INCLUDING OTHER USERS), OR ANY USER CONTENT YOU SUBMIT. IN SIMPLE TERMS, THIS 
              MEANS THAT IF YOUR ACTIONS CAUSE A LEGAL PROBLEM FOR AMICARE, YOU WILL BE 
              RESPONSIBLE FOR THE COSTS ASSOCIATED WITH IT.
            </Text>

            <Text style={styles.sectionTitle}>10. Managing Your Account and These Terms</Text>

            <Text style={styles.paragraph}>
              This section covers the lifecycle of your account and our agreement.
            </Text>

            <Text style={styles.subSectionTitle}>10.1 Ending Your Relationship with Amicare (Account Termination)</Text>
            <Text style={styles.paragraph}>
              You can choose to end your relationship with Amicare at any time by terminating your account. 
              In compliance with app store requirements, you can initiate the deletion of your account 
              directly from within the App's account settings. Upon termination, your access to the Platform 
              will cease, and your data will be handled according to the retention schedules outlined in our 
              Privacy Policy.
            </Text>

            <Text style={styles.subSectionTitle}>10.2 Our Right to Suspend or Terminate Your Account</Text>
            <Text style={styles.paragraph}>
              We reserve the right to suspend or terminate your User Account and access to the Platform at 
              our discretion, with or without notice, for reasons including, but not limited to:
            </Text>

            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                • A breach of these Terms or our Privacy Policy.
              </Text>
              <Text style={styles.bullet}>
                • Any fraudulent, abusive, or illegal activity.
              </Text>
              <Text style={styles.bullet}>
                • Failure to pass or maintain our identity verification standards.
              </Text>
              <Text style={styles.bullet}>
                • Posing a safety concern to our community.
              </Text>
              <Text style={styles.bullet}>
                • Prolonged account inactivity.
              </Text>
            </View>

            <Text style={styles.subSectionTitle}>10.3 Updates to These Terms</Text>
            <Text style={styles.paragraph}>
              We may need to update these Terms from time to time to reflect changes in our services or the 
              law. When we do, we will notify you of the changes through an in-app notification, an email to 
              your registered address, or by posting the updated Terms on our Platform.
            </Text>

            <Text style={styles.paragraph}>
              For any changes that we consider material – meaning they significantly affect your rights or 
              obligations – we will require you to actively re-accept the new Terms (for example, by clicking 
              an "I Agree" button) before you can continue using the Platform. This ensures that your 
              continued use is based on a clear and informed agreement to the updated rules. The "Last 
              Updated" date at the top of this page will always show you when the Terms were last revised.
            </Text>

            <Text style={styles.sectionTitle}>11. General Legal Provisions</Text>

            <Text style={styles.paragraph}>
              This final section includes some standard but important legal clauses that help our agreement 
              function properly.
            </Text>

            <Text style={styles.subSectionTitle}>11.1 Governing Law and Jurisdiction</Text>
            <Text style={styles.paragraph}>
              These Terms and any dispute arising from them will be governed by the laws of the Province of 
              Ontario and the federal laws of Canada applicable therein. Any legal proceedings that are not 
              subject to arbitration will be brought exclusively in the courts located in Toronto, Ontario.
            </Text>

            <Text style={styles.subSectionTitle}>11.2 Entire Agreement, Severability, and Waiver</Text>
            <View style={styles.bullets}>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Entire Agreement:</Text> These Terms, along with our Privacy Policy and any other documents 
                referenced herein, constitute the entire agreement between you and Amicare, 
                superseding any prior agreements.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Severability:</Text> If any part of these Terms is found to be invalid or unenforceable, the 
                remaining provisions will continue to be in full force and effect.
              </Text>
              <Text style={styles.bullet}>
                • <Text style={{ fontWeight: 'bold' }}>Waiver:</Text> If we fail to enforce a right or provision of these Terms, it will not be considered 
                a waiver of our right to do so in the future.
              </Text>
            </View>

            <Text style={styles.subSectionTitle}>11.3 Assignment</Text>
            <Text style={styles.paragraph}>
              You may not assign or transfer your rights or obligations under these Terms without our prior 
              written consent. Amicare may assign its rights and obligations without restriction, such as in 
              the event of a merger, acquisition, or sale of assets.
            </Text>

            <Text style={styles.subSectionTitle}>11.4 Contacting Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions about these Terms of Use or need to send us a legal notice, please 
              contact us at:
            </Text>

            <Text style={styles.paragraph}>
              Amicare Inc.{'\n'}
              18 King Street East, Suite 1400{'\n'}
              Toronto, ON M5C 1C4{'\n'}
              Canada{'\n'}
              Email: info@amicare.io{'\n'}
              Phone: +1 (888) 994-9114
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// Default export for backwards compatibility
export default TermsOfUseLink;

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
  effectiveDate: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
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