import React from 'react';
import ErrorPage from '../components/ErrorPage';

export default function Error404() {
  return <ErrorPage message="This page does not exist." statusCode={404} />;
}
