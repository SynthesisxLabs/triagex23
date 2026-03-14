import { Redirect } from 'expo-router';

export default function Index() {
  // In a real app, check for auth session here.
  // If not logged in, redirect to onboarding.
  return <Redirect href="/(auth)/onboarding" />;
}
