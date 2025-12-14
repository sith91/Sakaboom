'use client';

import React, { ReactNode } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

export const FirebaseClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const firebase = initializeFirebase();

  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
};
