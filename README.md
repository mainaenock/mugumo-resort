# The Mugumo Valley Resort

A seven-page Next.js frontend for The Mugumo Valley Resort in Thika, Kenya. The site provides room comparisons, dining and resort information, local attractions, a gallery, and directions. Booking links go to the resort’s listed phone number or Expedia.

## Preview locally

```sh
npm ci
npm run dev
```

Visit [localhost:3000](http://localhost:3000).

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
