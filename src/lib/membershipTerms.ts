// Salon Membership Terms & Conditions — applies to all locations.
// Shown (and must be accepted) before a customer is sent to checkout.

export interface TermsSection {
  title: string;
  paragraphs: string[];
}

export const MEMBERSHIP_TERMS = {
  title: "Salon Membership Terms & Conditions",
  intro:
    "Thank you for choosing Love You Nail Salon. Our membership program is designed to provide ongoing beauty and wellness services at exclusive member pricing. By purchasing a membership, you acknowledge that you have read, understood, and agree to the following Terms & Conditions.",
  sections: [
    {
      title: "One-Year Membership Commitment",
      paragraphs: [
        "All salon memberships are sold as a 12-month (one-year) commitment beginning on the date of purchase.",
        "By enrolling, you are entering into a binding membership agreement for the full membership term.",
        "Membership benefits are intended for use throughout the one-year commitment and are available only to the enrolled member.",
      ],
    },
    {
      title: "No Refund Policy",
      paragraphs: [
        "ALL MEMBERSHIP SALES ARE FINAL.",
        "Once a membership agreement has been executed, the member is financially responsible for the full one-year commitment.",
        "Purchasing a membership constitutes your acknowledgment and acceptance of this strict no-refund policy.",
      ],
    },
    {
      title: "Membership Payments",
      paragraphs: [
        "Members are responsible for making all scheduled membership payments as agreed at the time of enrollment.",
        "If the membership is financed through monthly installments, the payment obligation remains in effect for the entire 12-month term.",
        "Failure to use membership services does not relieve the member of their payment obligations.",
      ],
    },
    {
      title: "Non-Transferable Membership",
      paragraphs: [
        "Memberships are issued to the individual purchaser only and cannot be transferred, shared, or assigned to another individual, and have no cash value.",
      ],
    },
    {
      title: "Appointment Policy",
      paragraphs: [
        "Membership services are provided by appointment only and are subject to salon availability. Members are encouraged to schedule appointments in advance.",
        "Our standard cancellation and no-show policies apply to all membership appointments.",
      ],
    },
    {
      title: "Salon Rights",
      paragraphs: [
        "The salon reserves the right to suspend or terminate membership privileges for misuse of benefits, fraudulent activity, abusive behavior toward staff or clients, or violations of salon policies. Such termination does not entitle the member to any refund, credit, or release from any remaining payment obligations.",
      ],
    },
    {
      title: "Policy Changes",
      paragraphs: [
        "The salon reserves the right to amend these policies at any time to comply with operational, legal, or business requirements. Any changes will apply in accordance with applicable law.",
      ],
    },
  ] as TermsSection[],
  acknowledgmentIntro:
    "By checking the box below, I acknowledge and agree that:",
  acknowledgments: [
    "I am voluntarily enrolling in a 12-month salon membership.",
    "I understand that all membership sales are final.",
    "I understand that no refunds, partial refunds, credits, or cancellations will be granted once the membership has been purchased, except where required by applicable law.",
    "I understand that my failure to use the membership does not entitle me to a refund or release me from my payment obligations.",
    "I have read, understood, and agree to abide by all terms and conditions of this Membership Agreement.",
  ],
  confirmLabel:
    "I have read and agree to the Membership Terms & Conditions above.",
};
