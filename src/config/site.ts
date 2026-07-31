/**
 * Central business configuration.
 * Edit this file to change contact details, delivery charges, coupons etc.
 */

export const site = {
  name: "Little Feet BD",
  tagline: "Little Steps, Big Adventures",
  description:
    "Everyday baby and kids essentials — shoes, feeding, nursery and play — thoughtfully selected for growing children in Bangladesh.",
  phone: "+880 1XXX-XXXXXX",
  phoneHref: "tel:+8801000000000",
  whatsapp: "8801000000000",
  email: "support@littlefeetbd.com",
  address: "House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh",
  location: "Bangladesh",
  hours: "Saturday–Thursday, 10:00 AM – 8:00 PM",
  delivery: "Nationwide delivery across Bangladesh",
  payments: "Cash on Delivery, bKash and Nagad",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    messenger: "https://m.me",
    whatsapp: "https://wa.me/8801000000000",
  },
  developerCredit: "Designed & developed by Your Agency Name",
} as const;

export const shipping = {
  insideDhaka: 70,
  outsideDhaka: 130,
  freeThreshold: 3000,
  etaInsideDhaka: "1–2 business days",
  etaOutsideDhaka: "2–4 business days",
} as const;

/** Demo coupon codes. Replace with API-driven promotions later. */
export const coupons = [
  { code: "LITTLE10", type: "percent" as const, value: 10, minSubtotal: 1500, label: "10% off orders over ৳1,500" },
  { code: "FEET200", type: "flat" as const, value: 200, minSubtotal: 2500, label: "৳200 off orders over ৳2,500" },
  { code: "FREESHIP", type: "shipping" as const, value: 0, minSubtotal: 1000, label: "Free delivery over ৳1,000" },
];

export const divisions: Record<string, string[]> = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Manikganj", "Munshiganj"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Cumilla", "Feni", "Noakhali"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rajshahi: ["Rajshahi", "Bogura", "Pabna", "Natore", "Sirajganj"],
  Khulna: ["Khulna", "Jashore", "Kushtia", "Satkhira"],
  Barishal: ["Barishal", "Bhola", "Patuakhali", "Pirojpur"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram", "Thakurgaon"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};
