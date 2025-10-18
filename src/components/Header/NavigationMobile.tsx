import { Box, Burger, Divider, Drawer } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { AuthButtons } from './AuthButtons';
import { Logo } from './Logo';
import classes from './Style.module.css';
import { ThemeSwitcher } from './ThemeSwitcher';

export const NavigationMobile = () => {
  const smallScreen = useMediaQuery(`(max-width: 575px)`);
  const [opened, { close, toggle }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title={<Logo />}
        size="xs"
        pos="relative"
        hiddenFrom="md"
        // without this prop, opening the drawer in prod will throw a client side exception
        transitionProps={{
          transition: 'slide-right',
        }}
      >
        <Divider my="sm" className={classes.divider} />
        <AuthButtons />
        <Box
          display={smallScreen ? 'block' : 'none'}
          pos="fixed"
          bottom="0"
          w="90%"
          py={8}
        >
          <ThemeSwitcher />
        </Box>
      </Drawer>
      <Burger opened={opened} onClick={toggle} hiddenFrom="md" />
    </>
  );
};
