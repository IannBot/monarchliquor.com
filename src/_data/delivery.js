// Delivery terms and zones. The owner flagged the previous delivery page as outdated,
// so every claim carries a `confirmed` flag. Templates render a claim only when
// confirmed; otherwise a neutral fallback is shown and the build prints a warning.
//
// OWNER TODO: review each term, set confirmed: true, and fill in ZIP lists.

export default {
  reviewedOn: null, // ISO date the owner last confirmed these terms

  terms: {
    freeOver: {
      amount: 50,
      text: "Free delivery on orders over $50.",
      fallback: "Delivery fee shown at checkout.",
      confirmed: false,
    },
    smallOrderFee: {
      text: "For smaller orders, a delivery fee is calculated and shown at checkout before you pay.",
      fallback: "Any delivery fee is shown at checkout before you pay.",
      confirmed: false,
    },
    sameDay: {
      text: "Most orders placed during store hours arrive the same day, often within a couple of hours. During busy times like weekends and holidays, delivery windows may run a little longer.",
      fallback: "Orders are delivered during store hours, Monday through Saturday.",
      confirmed: false,
    },
    gifts: {
      text: "Yes! Add delivery instructions at checkout and we'll bring the order to your recipient. The recipient must be 21 or older and show valid ID when accepting the delivery.",
      fallback: "Call either store to arrange a gift delivery: East Austin (512) 614-4949 or Lakeway (512) 300-0065.",
      confirmed: false,
    },
    returns: {
      text: "Unopened products in their original condition can usually be exchanged in store. Call the store you ordered from (East Austin (512) 614-4949, Lakeway (512) 300-0065) and we'll make it right.",
      fallback: "Call the store you ordered from about returns or exchanges: East Austin (512) 614-4949 or Lakeway (512) 300-0065.",
      confirmed: false,
    },
    specialOrders: {
      text: "Absolutely. If a product is available from our distributors, we can usually have it in store within a few days. Call or email either location with what you're looking for.",
      fallback: "Call or email either location about special orders.",
      confirmed: false,
    },
    // Legal requirement, not a business choice. Always rendered.
    idPolicy: {
      text: "The person receiving the order must be 21 or older and present a valid government-issued photo ID at handoff. If no one of age is available to accept the order, it returns to the store.",
      confirmed: true,
    },
  },

  // Shown wherever a zone claim is unconfirmed.
  zoneFallback: "Call East Austin (512) 614-4949 or Lakeway (512) 300-0065 to confirm delivery to your address.",

  zones: [
    {
      storeId: "east-austin",
      label: "East Austin and Central Austin",
      sentence: "East Austin and Central Austin",
      neighborhoods: ["East Austin", "Central Austin"],
      zips: [], // OWNER TODO
      confirmed: false,
    },
    {
      storeId: "lakeway",
      label: "all Lakeway neighborhoods, Steiner Ranch, and the Lake Travis area",
      sentence: "All Lakeway neighborhoods, Steiner Ranch, and the Lake Travis area",
      neighborhoods: ["Lakeway", "Steiner Ranch", "Lake Travis"],
      zips: [], // OWNER TODO
      confirmed: false,
    },
  ],
};
