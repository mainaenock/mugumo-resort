export const resort = {
  name: "The Mugumo Valley Resort",
  address: "Riverside Road, Thika, Kiambu County",
  phone: "+254 759 261 055",
  tel: "tel:+254759261055",
  maps: "https://www.google.com/maps/search/?api=1&query=The+Mugumo+Valley+Resort%2C+Thika%2C+Kenya",
  listing: "https://www.expedia.com/Thika-Hotels-The-Mugumo-Valley-Resort.h119097002.Hotel-Information",
  diningTerraceListing: "https://www.skyscanner.net/hotels/kenya/thika-hotels/the-mugumo-valley-resort/ht-212251718",
  google: "https://www.google.com/travel/hotels/entity/ChkIrrHI4ZbGy7VSGg0vZy8xMXNoMDZ5NXlnEAE",
};

export const resortMark = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/mugumo-resort-hero.webp`;

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Stay", href: "/rooms/" },
  { label: "Dining", href: "/dining/" },
  { label: "Resort", href: "/resort/" },
  { label: "Explore", href: "/attractions/" },
  { label: "Gallery", href: "/gallery/" },
];

export type Photo = { file: string; alt: string };

export const photos = {
  grounds: { file: "grounds", alt: "Wooden buildings and garden seating among trees at The Mugumo Valley Resort" },
  pool: { file: "pool-main", alt: "Blue outdoor pool and poolside terrace at The Mugumo Valley Resort" },
  gardenPool: { file: "pool-garden", alt: "Curved outdoor pool with tables and umbrellas on the lawn" },
  leisure: { file: "pool-leisure", alt: "Guests at the outdoor pool with the resort buildings and gardens behind them" },
  playground: { file: "playground", alt: "Slides and climbing equipment on the resort lawn" },
  diningTerrace: { file: "dining-terrace", alt: "Tables set in green and white on the covered poolside dining terrace at The Mugumo Valley Resort" },
  barTable: { file: "bar-table", alt: "A bottle of wine and two glasses on a table at the resort" },
  diningIllustration: { file: "dining-illustration", alt: "Illustration of a plated meal with browned meat, onions and herbs" },
  double: { file: "double", alt: "Deluxe double room with a double bed and white linens" },
  twin: { file: "twin", alt: "Deluxe twin room with two separately made beds" },
  single: { file: "single", alt: "Deluxe single room with a wood headboard and white linens" },
  falls: { file: "fourteen-falls", alt: "Fourteen Falls on the Athi River near Thika" },
  mountain: { file: "kilimambogo", alt: "Mount Kilimambogo in Ol Donyo Sabuk National Park" },
  chania: { file: "chania-falls", alt: "Chania Falls in Thika" },
} satisfies Record<string, Photo>;

export const rooms = [
  { name: "Deluxe Double", guests: "2 guests", bed: "1 double bed", photo: photos.double },
  { name: "Deluxe Twin", guests: "2 guests", bed: "2 twin beds", photo: photos.twin },
  { name: "Deluxe Single", guests: "1 guest", bed: "1 twin bed", photo: photos.single },
];

export const attractions = [
  {
    name: "Fourteen Falls",
    type: "Athi River",
    description: "The Athi River spills over a broad rock ledge near Thika. Follow the map to the falls and check access conditions before setting out.",
    mapQuery: "Fourteen Falls, Thika, Kenya",
    photo: photos.falls,
    credit: { author: "Galkey", href: "https://commons.wikimedia.org/wiki/File:Fourteen_Falls.jpg", license: "CC BY-SA 4.0", licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/" },
  },
  {
    name: "Ol Donyo Sabuk National Park",
    type: "Hiking & nature",
    description: "Explore trails on Mount Kilimambogo, with picnic sites and the historic McMillan burial site within the park. Kenya Wildlife Service publishes entry information and visitor guidance.",
    mapQuery: "Ol Donyo Sabuk National Park main gate",
    official: "https://kws.go.ke/park/oldonyo-sabuk-national-park/",
    photo: photos.mountain,
    credit: { author: "William Mescudi Kiarie", href: "https://commons.wikimedia.org/wiki/File:Mt_Kilimambogo.jpg", license: "CC0 1.0", licenseHref: "https://creativecommons.org/publicdomain/zero/1.0/" },
  },
  {
    name: "Chania Falls",
    type: "Thika town",
    description: "A waterfall on the Chania River in Thika. Use the map to locate the falls and confirm access locally when planning your visit.",
    mapQuery: "Chania Falls, Thika, Kenya",
    photo: photos.chania,
    credit: { author: "Wikiwand7", href: "https://commons.wikimedia.org/wiki/File:Waterfall_on_the_Thika_River.jpg", license: "CC BY-SA 4.0", licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/" },
  },
];

export function imagePath(photo: Photo) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${photo.file}.webp`;
}
