import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Share your experience with threadly.one. Your feedback helps us improve our custom embroidery products and service.",
  alternates: { canonical: "https://threadly.one/feedback" },
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
