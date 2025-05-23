import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/admin/dashboard');
  // The redirect function should be called outside of the return statement.
  // It will interrupt rendering and redirect the user.
  // Thus, no JSX content is needed here.
  return null;
}
