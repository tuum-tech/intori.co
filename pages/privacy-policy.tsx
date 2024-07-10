import type { NextPage } from "next";
import { LegalLayout } from '../layouts/Legal'

const Privacy: NextPage = () => {
  return (
    <LegalLayout>
      <h1>Intori Privacy Policy</h1>
      <p><strong>Last Updated: 10 July, 2024</strong></p>

      <h2>Who we are</h2>
      <p>The intori service is owned by Tuum Technologies, Inc. (&quot;Tuum&quot; or &quot;we&quot; or &quot;us&quot; or &quot;our&quot;).</p>
      <p>We can be contacted in several ways:</p>
      <p>
        By email to: <a href="mailto:contact@tuum.tech">contact@tuum.tech</a>
      </p>
      <p>In writing to:</p>
      <address>
        Tuum Technologies, Inc.<br />
        4030 Wake Forest Road, STE 349<br />
        Raleigh, NC 27609
      </address>

      <h2>What is intori? Overview, background and context</h2>
      <p>
        The intori (Inter-Origins) web app and associated Farcaster Frames (together referred to as the intori App) enables users to (i) track and manage their preferences and traits data history; (ii) leverage data from Farcaster’s API and user-provided data to discover relevant connections; and (iii) additional functionality as Tuum may add to the app from time to time (collectively, the &quot;App&quot; or &quot;intori&quot;). This Privacy Policy (&quot;Privacy Policy&quot;) helps explain how we collect, use, store, and protect your information when you use the App, our developer software, or our website at <a href="https://intori.co" target="_blank" rel="noopener noreferrer">https://intori.co</a> (collectively the &quot;Services&quot;). Please also read intori’s Terms of Service (the “Terms”), which describe the terms under which you use the Services.
      </p>

      <h2>Information We Collect</h2>
      <p>We receive or collect information when we operate and provide our Services, including when you access, or use our Services.</p>
      <p>Essentially, the personal data collected by the intori service falls into two broad categories:</p>
      <ul>
        <li>Data we collect through or as part of the sign-in process; and</li>
        <li>The personal data (including preferences, traits, and interests) that you choose to share with the intori service through Farcaster</li>
      </ul>

      <h3>Information you provide:</h3>
      <ul>
        <li><strong>Your Account Information</strong> - In order to track and manage user-provided data, you will provide us with a Farcaster account. In order to connect and publish data to the Base blockchain, you will provide us with an Ethereum account.</li>
        <li><strong>Your Interests</strong> - Your preferences and traits (collectively the &quot;Interests&quot;), which you utilize to access personalized connections include the following and is indicative but not exclusive of the types of data that will be available through the intori service:
          <ul>
            <li>Food & Drink</li>
            <li>Lifestyle & Wellness</li>
            <li>Entertainment & Hobbies</li>
            <li>Technology & Gadgets</li>
            <li>Travel & Leisure</li>
            <li>Values & Beliefs</li>
          </ul>
        </li>
        <li><strong>Customer Support</strong> - We may collect additional information you may disclose to our customer support team.</li>
      </ul>

      <h2>Information We DO NOT Collect</h2>
      <p>The first step in using the intori service is to establish a Farcaster Account and use this account to sign-in to the service. For this reason we DO NOT collect the following information:</p>
      <ul>
        <li>your name;</li>
        <li>your email address; and</li>
        <li>a mobile or other phone number</li>
      </ul>

      <h2>How We Use The Information We Collect</h2>
      <p>Our primary purpose in collecting information is to help us operate, provide, improve, customize, and support our Services. We may use your information to:</p>
      <ul>
        <li>Provide the Services and customer support you request;</li>
        <li>Resolve disputes and troubleshoot problems; and</li>
        <li>Prevent and investigate potentially prohibited or illegal activities, and/or violations of our posted User Agreement;</li>
      </ul>
      <p>We will not use your information for purposes other than those purposes we have disclosed to you, without your permission.</p>

      <h2>Marketing</h2>
      <p>We will never sell or rent your information to third parties.</p>
      <p>We do not allow third-party banner ads on intori, but if we ever do, we will update this policy.</p>

      <h2>How Your Information Is Shared With Other intori Users</h2>
      <p>If you use your account to submit responses to the Farcaster Frame, users with the same response will have access to your response information for those questions. Users with whom you have matching responses with may store or re-share your information with others, on or off of our Services. We, however, will never share your transaction information.</p>

      <h2>How We Share Information With Third Parties</h2>
      <p>We may share information with law enforcement, government officials, or other third parties when:</p>
      <ul>
        <li>We are compelled to do so by a subpoena, court order, or similar legal procedure; or</li>
        <li>We believe in good faith that the disclosure of personal information is necessary to prevent physical harm or financial loss, to report suspected illegal activity or to investigate violations of our Terms.</li>
      </ul>
      <p>Finally, we may share information with companies or other entities that we plan to merge with or be acquired by. Should such a combination occur, we will require that the new combined entity follow this Privacy Policy with respect to your personal information.</p>

      <h2>How you can access or change your information</h2>
      <p>If you would like to delete your information, you may do so by reaching us at Contact Us.</p>
      <p>You may delete your intori account at any time.</p>

      <h2>Our Global Operations</h2>
      <p>You agree to our information practices, including the collection, use, processing, and sharing of your information as described in this Privacy Policy, as well as the transfer and processing of your information to the United States and other countries globally where we have or use facilities, service providers, or partners, regardless of where you use our Services.</p>
      <p>You acknowledge that the laws, regulations, and standards of the country in which your information is stored or processed may be different from those of your own country. However, we require our service providers to treat your information in strict confidence and use appropriate security measures to protect it. We also require them to uphold all obligations under this Privacy Policy.</p>

      <h2>Updates To Our Policy</h2>
      <p>We may amend or update our Privacy Policy from time to time and give you the opportunity to review the updated Privacy Policy before choosing to continue to use intori. We will notify you of material changes to this policy by updating the last updated date at the top of this page.</p>

      <h2>Contact Us</h2>
      <p>If you have any questions about our Privacy Policy, please do not hesitate to contact us at <a href="mailto:contact@tuum.tech">contact@tuum.tech</a>.</p>
    </LegalLayout>
  )
}

export default Privacy
