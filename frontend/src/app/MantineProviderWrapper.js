'use client';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export default function MantineProviderWrapper({ children }) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      {children}
    </MantineProvider>
  );
}