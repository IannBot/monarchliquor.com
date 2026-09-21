// Delivery terms and zones. Each claim carries a `confirmed` flag: templates
// render the `text` only when confirmed and the neutral `fallback` otherwise,
// and the build prints a warning for anything still unconfirmed.
//
// Terms below marked confirmed were supplied by the owner on 2026-09-21.
// OWNER TODO: the delivery zones (with ZIP lists) are still open.

const EAST = "(512) 614-4949";
const LAKE = "(512) 300-0065";

export default {
  reviewedOn: "2026-09-21",

  terms: {
    hours: {
      text: "Mon–Sat 10am–9pm. Closed Sunday and TABC holidays.",
      confirmed: true,
    },
    fee: {
      text: "Shown at checkout. Typically $5, and we often run $0-delivery promotions.",
      fallback: "Delivery fee shown at checkout.",
      confirmed: true,
    },
    timing: {
      text: "Order any time. Deliveries go out during store hours, from 30 minutes after opening until 30 minutes before closing, Monday through Saturday.",
      fallback: "Orders are delivered during store hours, Monday through Saturday.",
      confirmed: true,
    },
    gifts: {
      text: "Yes! Add delivery instructions at checkout and we'll bring the order to your recipient. The recipient must be 21 or older and show valid ID when accepting the delivery.",
      fallback: `Call either store to arrange a gift delivery: East Austin ${EAST} or Lakeway ${LAKE}.`,
      confirmed: true,
    },
    returns: {
      text: "Not permitted. Under TABC law, alcohol can't be returned once sold, so please check your order at handoff.",
      fallback: `Call the store you ordered from about your order: East Austin ${EAST} or Lakeway ${LAKE}.`,
      confirmed: true,
    },
    specialOrders: {
      text: "We often bring in new or exclusive products for our customers. Give us a call and we'll see what we can work out.",
      fallback: "Call or email either store about special orders.",
      confirmed: true,
    },
    largeOrders: {
      threshold: 300,
      text: "Orders over $300 require the physical payment card to be present at the time of delivery.",
      confirmed: true,
    },
    // Legal requirement, not a business choice. Always rendered.
    idPolicy: {
      text: "The person receiving the order must be 21 or older and present a valid government-issued photo ID at handoff. If no one of age is available to accept the order, it returns to the store.",
      confirmed: true,
    },
  },

  // The direct-vs-apps comparison, shown with the marketplace badges.
  directAdvantage: "Ordering directly from us is usually at least 5% cheaper than the apps, and it arrives faster with fewer issues because our own team packs and delivers it.",

  // Shown wherever a zone claim is unconfirmed.
  zoneFallback: `Call East Austin ${EAST} or Lakeway ${LAKE} to confirm delivery to your address.`,

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
