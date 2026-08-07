import type { Metadata } from "next";
import Policy from "@/components/Policy";

export const metadata: Metadata = {
  title: "Salon Policy | Love You Nail Salon",
  description:
    "Love You Nail Salon appointment, cancellation, payment, refund and salon policies.",
};

export default function SalonPolicyPage() {
  return (
    <Policy
      title="Salon Policy"
      intro="At Love You, we strive to provide our clients with exceptional service in a professional and welcoming environment. To ensure a smooth experience for everyone, please review our salon policies."
      sections={[
        {
          title: "Appointments",
          paragraphs: [
            "Scheduling: Appointments can be made online, via phone, or in-person. We recommend booking in advance, especially during peak times.",
          ],
        },
        {
          title: "No-Show, Late Cancellation & Rescheduling",
          paragraphs: [
            "Please cancel or reschedule your appointment at least 24 hours in advance to avoid being charged. Appointments canceled or rescheduled within 24 hours will be charged 100%. If you are more than 15 minutes late for your appointment, you will be considered a no-show and charged in full for the services you reserved. All sales are final.",
          ],
        },
        {
          title: "Payment",
          paragraphs: [
            "Accepted Payments: We accept credit/debit cards and gift certificates. Payment is due at the time of service.",
            "Gratuity: Gratuity is not included in the service price. If you enjoyed your service, a tip for your technician is appreciated.",
            "A deposit may be required for certain services or appointments.",
            "Prices are non-negotiable and subject to change without prior notice.",
            "Gift cards and vouchers must be presented at the time of payment.",
          ],
        },
        {
          title: "Refund Policy",
          paragraphs: [
            "Refunds will only be issued in the form of store credit.",
            "Refund requests must be made within 24 hours of the service being rendered.",
            "Refunds will not be provided for gift cards, vouchers, or products purchased.",
          ],
        },
        {
          title: "Services",
          paragraphs: [
            "Consultations: We encourage consultations before any service to discuss your preferences and expectations.",
            "Satisfaction Guarantee: Your satisfaction is our priority. If you are not satisfied with your service, please let us know within 7 days so we can address your concerns.",
            "Service Modifications: We reserve the right to modify services based on the condition of your nails and skin. Your technician will provide recommendations.",
          ],
        },
        {
          title: "Health & Safety",
          paragraphs: [
            "Health Concerns: Please inform us of any allergies, sensitivities, or medical conditions prior to your appointment.",
            "We adhere to all local health and safety guidelines to ensure the well-being of our clients and staff.",
          ],
        },
        {
          title: "Children",
          paragraphs: [
            "For the comfort and safety of all our clients, we ask that children are supervised at all times. We cannot be responsible for any accidents.",
          ],
        },
        {
          title: "Behavior",
          paragraphs: [
            "Respectful Environment: We maintain a respectful and professional environment. Any inappropriate behavior or language will not be tolerated and may result in termination of services.",
            "Personal Belongings: Please keep your belongings with you. We are not responsible for lost or stolen items.",
          ],
        },
        {
          title: "Changes to Policy",
          paragraphs: [
            "We reserve the right to amend our policies at any time. Any changes will be communicated to our clients.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            "For any questions or clarifications regarding our policies, please contact your nearest studio or email us at loveyounailsalon@gmail.com. Thank you for choosing Love You Nail Salon — we look forward to serving you!",
          ],
        },
      ]}
    />
  );
}
