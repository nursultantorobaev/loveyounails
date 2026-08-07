import type { Metadata } from "next";
import Policy from "@/components/Policy";

export const metadata: Metadata = {
  title: "Privacy Policy | Love You Nail Salon",
  description:
    "How Love You Nail Salon collects, uses and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <Policy
      title="Privacy Policy"
      intro="At Love You Nail Salon, we value your privacy and are committed to protecting your personal information."
      sections={[
        {
          title: "Information We Collect",
          paragraphs: [
            "We collect personal details such as your name, phone number, and email address when you book an appointment or contact us. This information is used solely to manage your appointments, send confirmations and reminders (via email or SMS), and provide the best possible service.",
          ],
        },
        {
          title: "Text Messaging",
          paragraphs: [
            "By providing your phone number, you consent to receive SMS messages regarding your appointments, including confirmations, reminders, and updates. You may opt out of SMS communications at any time by replying “STOP.”",
          ],
        },
        {
          title: "Data Sharing",
          paragraphs: [
            "We do not sell or share your personal information with third parties, except as necessary to operate our booking systems (such as Square and Fresha) or as required by law.",
          ],
        },
        {
          title: "Security",
          paragraphs: [
            "We implement appropriate technical and organizational measures to safeguard your data.",
          ],
        },
        {
          title: "Your Rights",
          paragraphs: [
            "You have the right to access, update, or delete your personal information. Please contact us at loveyounailsalon@gmail.com for any data-related inquiries.",
          ],
        },
        {
          title: "Policy Updates",
          paragraphs: [
            "We may update this policy from time to time. The most recent version will always be available on our website.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            "If you have any questions about this policy, please email us at loveyounailsalon@gmail.com.",
          ],
        },
      ]}
    />
  );
}
