import { MessageCircle } from "lucide-react";
import { site } from "@/config/site";

export function FloatingContact() {
  return (
    <a
      href={site.social.whatsapp}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 right-4 z-[65] inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-primary-dark shadow-lift transition-transform hover:scale-105 lg:bottom-6"
    >
      <MessageCircle size={20} />
    </a>
  );
}
