import { Carousel } from '@mantine/carousel';
import { Center, Image } from '@mantine/core';

const images = [
  'https://res.cloudinary.com/dicme7cio/image/upload/v1698793460/car-go-rentals/cars-1_zdwwnu.png',
  'https://res.cloudinary.com/dicme7cio/image/upload/v1698793460/car-go-rentals/cars-2_ygogni.png',
];
export const Slider = () => {
  return (
    <Carousel withIndicators loop>
      {images.map((image) => (
        <Carousel.Slide key={image} mt="2rem">
          <Center h={{ base: 300, md: 400, xl: 600 }} mx="auto">
            <Image src={image} alt="" />
          </Center>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};
