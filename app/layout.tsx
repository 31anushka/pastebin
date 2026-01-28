// // app/layout.tsx
// export const metadata = {
//   title: 'Pastebin Lite',
//   description: 'Share text snippets with optional expiry and view limits',
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }

export const metadata = {
  title: 'Pastebin Lite',
  description: 'Share text snippets with optional expiry and view limits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}