// FAQ bank. Each group renders as visible <details> and as FAQPage JSON-LD from the
// same text, so the two can never disagree. Answers are plain text (no HTML).
//
// Delivery answers reference delivery.js terms; the `term` key lets templates and
// schema swap in the fallback wording when a term is unconfirmed.

export default {
  delivery: [
    {
      q: "Where do you deliver?",
      a: "Our East Austin store delivers across East and Central Austin, and our Lakeway store delivers to all Lakeway neighborhoods, Steiner Ranch, and the Lake Travis area. Not sure if you're in our zone? Call East Austin at (512) 614-4949 or Lakeway at (512) 300-0065 and we'll check.",
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
      a: "Unopened products in their original condition can usually be exchanged in store. Call the store you ordered from (East Austin (512) 614-4949, Lakeway (512) 300-0065) and we'll make it right.",
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
  hours: [
    {
      q: "Is Monarch Liquor open on Sunday?",
      a: "No. Texas law requires package liquor stores to close on Sundays, so both Monarch Liquor stores are closed every Sunday. We are open Monday through Saturday from 10am to 9pm.",
    },
    {
      q: "Is Monarch Liquor open on holidays?",
      a: "Yes. Both stores are open every holiday except Sundays, Thanksgiving Day, Christmas Day, and New Year's Day, when Texas law requires liquor stores to close. Regular hours apply on all other holidays: Monday through Saturday, 10am to 9pm.",
    },
    {
      q: "What time does Monarch Liquor close?",
      a: "Both stores close at 9pm Monday through Saturday and are closed on Sunday. Holiday hours are posted on each store page when they differ.",
    },
  ],
  "east-austin": [
    {
      q: "Where is Monarch Liquor in East Austin?",
      a: "Monarch Liquor East Austin is at 1902 E. Martin Luther King Jr. Blvd, Austin, TX 78702, on the corner of MLK and Chicon St. next to JuiceLand, Austin Daily Press, and The Wheel.",
    },
    {
      q: "What are the East Austin store hours?",
      a: "Monday through Saturday, 10am to 9pm. Closed Sunday, as required by Texas law.",
    },
    {
      q: "Does the East Austin store deliver?",
      a: "Yes. The East Austin store delivers across East and Central Austin. Order online and choose delivery, or call (512) 614-4949.",
      zone: "east-austin",
    },
    {
      q: "Is there curbside pickup in East Austin?",
      a: "Yes. Order online or by phone, park out front, and call (512) 614-4949 when you arrive. Have your ID ready; every recipient must be 21 or older.",
    },
  ],
  lakeway: [
    {
      q: "Where is Monarch Liquor in Lakeway?",
      a: "Monarch Liquor Lakeway is at 1700 Ranch Road 620 N, Suite 107B, Austin, TX 78734, near Lake Travis and right next to Don Mario Mexican Restaurant.",
    },
    {
      q: "What are the Lakeway store hours?",
      a: "Monday through Saturday, 10am to 9pm. Closed Sunday, as required by Texas law.",
    },
    {
      q: "Does Monarch Liquor deliver to Steiner Ranch and Lakeway?",
      a: "Yes. The Lakeway store delivers to all Lakeway neighborhoods, Steiner Ranch, and the Lake Travis area. Order online and choose delivery, or call (512) 300-0065.",
      zone: "lakeway",
    },
    {
      q: "Is there a liquor store near Lake Travis with a beer cave?",
      a: "Yes. Monarch Liquor Lakeway has a walk-in beer cave and a 17-door cooler, plus a large spirits and wine selection, minutes from Lake Travis.",
    },
  ],
};
