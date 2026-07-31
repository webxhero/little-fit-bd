export type Testimonial = {
  name: string;
  location: string;
  rating: number;
  text: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Nusrat Jahan",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    text: "Ordered the silicone feeding set for my 8-month-old. Packaging was neat and the quality is genuinely better than what I found in local shops.",
  },
  {
    name: "Tanvir Ahmed",
    location: "Chattogram",
    rating: 5,
    text: "The stroller reached Chattogram in two days with cash on delivery. Folding it one-handed while holding my daughter is exactly what we needed.",
  },
  {
    name: "Farhana Rahman",
    location: "Uttara, Dhaka",
    rating: 4,
    text: "First walker shoes were slightly big, and the exchange was handled without any argument. That alone made me a repeat customer.",
  },
  {
    name: "Sadia Islam",
    location: "Sylhet",
    rating: 5,
    text: "Muslin swaddles are wonderfully soft even after many washes. Perfect for our weather.",
  },
];

export const faqs = [
  {
    q: "Do you deliver outside Dhaka?",
    a: "Yes. We deliver to every district in Bangladesh. Inside Dhaka usually takes 1–2 business days and outside Dhaka 2–4 business days.",
  },
  {
    q: "Is Cash on Delivery available?",
    a: "Cash on Delivery is available nationwide. You can also pay in advance through bKash or Nagad if you prefer.",
  },
  {
    q: "What is the delivery charge?",
    a: "৳70 inside Dhaka and ৳130 outside Dhaka. Orders over ৳3,000 are delivered free anywhere in Bangladesh.",
  },
  {
    q: "Can I exchange a product if the size does not fit?",
    a: "Yes. Request an exchange within 3 days of delivery with the product unused and in its original packaging. We will arrange the swap.",
  },
  {
    q: "Are the products safe for newborns?",
    a: "Everything we sell is chosen for child safety — food-grade silicone, BPA-free plastics, non-toxic paints and skin-friendly fabrics.",
  },
  {
    q: "How do I track my order?",
    a: "Use the Track Order page with your order number. You will also receive updates on your mobile number as the parcel moves.",
  },
  {
    q: "Do you have a physical store?",
    a: "We operate online with a Dhaka-based warehouse. You are welcome to call our customer care line for product advice before ordering.",
  },
  {
    q: "How do I know a product is in stock?",
    a: "Stock status is shown on every product page. If something sells out, the Add to Cart button is disabled until it is restocked.",
  },
];
