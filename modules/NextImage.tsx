import Image from "next/image";

type NextImageProps = React.ComponentPropsWithoutRef<typeof Image>;

export const NextImage = (props: NextImageProps) => (
  <Image unoptimized={false} {...props} />
);
