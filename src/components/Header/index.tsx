'use client';
import { Box, Group } from '@mantine/core';
import React from 'react';
import { Logo } from './Logo';
import { ThemeSwitcher } from './ThemeSwitcher';
import { NavigationMobile } from './NavigationMobile';
import { AuthButtons } from './AuthButtons';
import { usePathname } from 'next/navigation';
import classes from './Style.module.css';

interface Props {
  isAuthPage?: boolean;
}
export const Navbar = ({ isAuthPage }: Props) => {
  const pathname = usePathname();

  return (
    <Box className={classes.header}>
      <Group justify="space-between" h="100%">
        <Logo />
        {!isAuthPage && !pathname.includes('my-account') && (
          <Box visibleFrom="md">
            <AuthButtons />
          </Box>
        )}
        <Box visibleFrom="xs">
          <ThemeSwitcher />
        </Box>
        <NavigationMobile />
      </Group>
    </Box>
  );
};
