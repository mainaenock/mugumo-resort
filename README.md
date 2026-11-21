# The Mugumo Valley Resort

A static-exportable Next.js frontend for The Mugumo Valley Resort in Thika, Kenya. It includes a room and dining catalog, a direct booking demo, resort information, local attractions, a gallery, and directions.

## Preview locally

```sh
npm ci
npm run dev
```

Visit [localhost:3000](http://localhost:3000).

## Try the booking demo

- Open [/rooms/](http://localhost:3000/rooms/) to compare room types and start checkout with a preferred room. At [/book/](http://localhost:3000/book/), pick dates, choose a room, enter sample guest details, and simulate a payment. A decline can be retried without making a reservation.
- Open [/admin/](http://localhost:3000/admin/) in the same browser to review reservations and payment attempts, cancel a booking, edit nightly room rates and counts, or change sample menu prices and visibility.
- The demo uses one room per stay, a sample inventory and KES rates, and full prepayment for the simulation. It saves reservations, simulated payment results, and catalog edits in browser local storage for the site’s origin. Use sample guest details. The admin is open, and no payments or emails are sent.

### Backend integration

`src/lib/booking.ts` contains the shared stay, reservation, and payment types. `src/lib/demo-store.ts` implements the browser storage and demo actions for checkout, cancellations, and catalog updates. The production version can replace that adapter with backend calls. Have the server own prices, inventory and reservation status, hold inventory transactionally during payment, and confirm the reservation after a verified payment-provider callback. Use idempotency for checkout and callback retries, require staff authorization for admin operations, and set the resort’s actual deposit, cancellation, and refund terms before accepting live bookings.

The booking sequence follows [Cloudbeds’ booking engine guide](https://developers.cloudbeds.com/docs/booking-engine). For real payment testing and confirmation, see [Stripe testing](https://docs.stripe.com/testing), [Stripe fulfillment](https://docs.stripe.com/checkout/fulfillment), and [Safaricom Daraja](https://developer.safaricom.co.ke/).

## Build a static preview

```sh
npm run build:static
```

The `out/` directory contains the HTML, scripts, styles, fonts, and photos. Serve that directory using a static host with directory indexes. For a project site served under a path such as `/mugumo-resort`, set `NEXT_PUBLIC_BASE_PATH=/mugumo-resort` before building. The export includes `.nojekyll` for branch-based GitHub Pages deployment.

## Content sources

- [Google Hotels](https://www.google.com/travel/hotels/entity/ChkIrrHI4ZbGy7VSGg0vZy8xMXNoMDZ5NXlnEAE) lists the resort’s phone number and location.
- [Expedia](https://www.expedia.com/Thika-Hotels-The-Mugumo-Valley-Resort.h119097002.Hotel-Information) and [Hotels.com](https://www.hotels.com/ho3812104064/the-mugumo-valley-resort/) list the room types, amenities and guest information, and provide the resort photography used for the preview. Confirm the resort’s permission to republish the listing photos before a public launch.
- [Skyscanner](https://www.skyscanner.net/hotels/kenya/thika-hotels/the-mugumo-valley-resort/ht-212251718) provides the poolside dining terrace photo. The food illustration on the Dining page was generated from supplied reference photos.
- [Kenya Wildlife Service](https://kws.go.ke/park/oldonyo-sabuk-national-park/) and [Kiambu County](https://kiambu.go.ke/wp-content/uploads/2024/08/Kiambu_CIDP_2023_2027_compressed-1.pdf) provide information about the nearby attractions. The gallery includes the attraction photo credits.
