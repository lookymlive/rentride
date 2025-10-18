'use client';
import { Container } from '@mantine/core';
import { Hero } from './Hero';
import dynamic from 'next/dynamic';

// Importing Map component dynamically removes ReferenceError: window is not defined
const Map = dynamic(() => import('@/components/Map/Map'), {
  ssr: false,
});

export const Landing = () => {
  return (
    <>
      <Hero />
      <Container mt="-3rem" px="1rem" mb="2rem">
        <Map />
      </Container>
    </>
  );
};
