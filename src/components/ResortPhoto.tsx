import Image from "next/image";
import { imagePath, type Photo } from "@/lib/resort";

export default function ResortPhoto({
  photo,
  sizes,
  priority = false,
}: {
  photo: Photo;
  sizes: string;
  priority?: boolean;
}) {
  return <Image src={imagePath(photo)} alt={photo.alt} fill sizes={sizes} priority={priority} />;
}
