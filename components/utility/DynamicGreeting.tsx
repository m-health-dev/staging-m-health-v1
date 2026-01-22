"use client";

import { useEffect, useState } from "react";
import { routing } from "@/i18n/routing";

interface DynamicGreetingProps {
  name: string;
  locale: string;
}

const greetings = {
  id: {
    morning: "Selamat Pagi",
    afternoon: "Selamat Siang",
    evening: "Selamat Sore",
    night: "Selamat Malam",
  },
  en: {
    morning: "Good Morning",
    afternoon: "Good Afternoon",
    evening: "Good Evening",
    night: "Good Night",
  },
};

const motivationalMessages = {
  id: [
    "Senang bertemu denganmu! 😊",
    "Apa yang akan kita lakukan hari ini?",
    "Semangat ya, hari ini pasti menyenangkan! 💪",

    "Tetap semangat dan jaga kesehatan! 🌟",
    "Mari wujudkan hal-hal hebat hari ini!",
    "Kamu luar biasa, terus berkarya! ✨",
  ],
  en: [
    "Nice to see you! 😊",
    "What shall we do today?",
    "Stay motivated, today will be great! 💪",

    "Stay strong and take care of your health! 🌟",
    "Let's make great things happen today!",
    "You're amazing, keep up the good work! ✨",
  ],
};

function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) {
    return "morning";
  } else if (hour >= 11 && hour < 15) {
    return "afternoon";
  } else if (hour >= 15 && hour < 18) {
    return "evening";
  } else {
    return "night";
  }
}

function getRandomMessage(locale: string): string {
  const messages =
    locale === routing.defaultLocale ? motivationalMessages.id : motivationalMessages.en;
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

const DynamicGreeting = ({ name, locale }: DynamicGreetingProps) => {
  const [greeting, setGreeting] = useState("");
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeOfDay = getTimeOfDay();
    const greetingText =
      locale === routing.defaultLocale ? greetings.id[timeOfDay] : greetings.en[timeOfDay];

    setGreeting(greetingText);
    setMessage(getRandomMessage(locale));
    setMounted(true);
  }, [locale]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="my-10">
        <h4 className="font-semibold text-primary">
          {locale === routing.defaultLocale ? "Halo" : "Hello"} {name}!
        </h4>
        <p className="mt-1 text-muted-foreground">
          {locale === routing.defaultLocale
            ? "Selamat datang di M Health Studio."
            : "Welcome to M Health Studio."}
        </p>
      </div>
    );
  }

  return (
    <div className="my-10">
      <h4 className="font-semibold text-primary">
        {greeting}, {name}! 👋
      </h4>
      <p className="mt-1 text-muted-foreground">{message}</p>
    </div>
  );
};

export default DynamicGreeting;
