// FAQ bank. Each group renders as visible <details> and as FAQPage JSON-LD from the
// same text, so the two can never disagree. Answers are plain text (no HTML).
//
// Delivery answers reference delivery.js terms; the `term` key lets templates and
// schema swap in the fallback wording when a term is unconfirmed.

export default {
  delivery: [
    {
      q: "Where do you deliver?",
      a: "Our East Austin store delivers across East and Central Austin, and our Lakeway store delivers to all Lakeway neighborhoods, Steiner Ranch, and the Lake Travis area. Not sure if you're in our zone? Give us a call at (512) 614-4949 and we'll check.",
    },
    {
      q: "How much does delivery cost?",
      a: "Delivery is free on orders over $50. For smaller orders, a delivery fee is calculated and shown at checkout before you pay.",
      term: "freeOver",
    },
    {
      q: "How fast will my order arrive?",
      a: "Most orders placed during store hours arrive the same day, often within a couple of hours. During busy times like weekends and holidays, delivery windows may run a little longer.",
      term: "sameDay",
    },
    {
      q: "Do you deliver on Sundays?",
      a: "No. Texas law requires liquor stores to close on Sundays, so we deliver Monday through Saturday, 10am to 9pm.",
    },
    {
      q: "Do I need to show ID?",
      a: "Yes. The person receiving the order must be 21 or older and present a valid government-issued photo ID at handoff. If no one of age is available to accept the order, it returns to the store.",
    },
    {
      q: "Can I return or exchange a product?",
      a: "Unopened products in their original condition can usually be exchanged in store. Give us a call at (512) 614-4949 and we'll make it right.",
      term: "returns",
    },
    {
      q: "Can you special order something you don't carry?",
      a: "Absolutely. If a product is available from our distributors, we can usually have it in store within a few days. Call or email either location with what you're looking for.",
      term: "specialOrders",
    },
    {
      q: "Can I send an order as a gift?",
      a: "Yes! Add delivery instructions at checkout and we'll bring the order to your recipient. The recipient must be 21 or older and show valid ID when accepting the delivery.",
      term: "gifts",
    },
  ],
};
