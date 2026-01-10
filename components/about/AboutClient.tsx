"use client";

import { delay, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  MessagesSquare,
  Stethoscope,
  Binoculars,
  Hospital,
} from "lucide-react";
import ContainerWrap from "../utility/ContainerWrap";
import CallToAction from "../utility/CallToAction";
import { fadeUpItem, staggerContainer } from "@/helper/animation";
import Lenis from "lenis";
import { useEffect } from "react";

const AnimatedSection = ({ children }: { children: React.ReactNode }) => (
  <motion.section
    variants={staggerContainer}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "50px" }}
  >
    {children}
  </motion.section>
);

const AboutClient = () => {
  const t = useTranslations("about");

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <AnimatedSection>
        <ContainerWrap size="xl">
          <motion.h2
            variants={fadeUpItem}
            className="mt-[10vh] mb-10 lg:text-center text-start text-primary font-bold"
          >
            {t("title")}
          </motion.h2>

          <motion.p
            variants={fadeUpItem}
            className="lg:text-center text-start max-w-5xl mx-auto text-lg! leading-7"
          >
            {t("description")}
          </motion.p>

          <motion.h2
            variants={fadeUpItem}
            className="mt-[10vh] mb-10 font-bold text-primary lg:text-center text-start"
          >
            {t("servicesTitle")}
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: MessagesSquare,
                title: t("services.chat.title"),
                desc: t("services.chat.desc"),
              },
              {
                icon: Stethoscope,
                title: t("services.teleconsult.title"),
                desc: t("services.teleconsult.desc"),
              },
              {
                icon: Binoculars,
                title: t("services.quality.title"),
                desc: t("services.quality.desc"),
              },
              {
                icon: Hospital,
                title: t("services.hospital.title"),
                desc: t("services.hospital.desc"),
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white p-5 rounded-2xl border cursor-pointer hover:shadow-xl"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="bg-health/10 p-3 rounded-xl border border-health">
                    <item.icon className="text-health" />
                  </div>
                  <h5 className="font-semibold text-health">{item.title}</h5>
                </div>
                <p className="leading-7">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            variants={fadeUpItem}
            className="mt-[20vh] lg:text-center text-start max-w-5xl mx-auto text-lg! text-primary leading-7 mb-20"
          >
            {t("closing")}
          </motion.p>
        </ContainerWrap>

        <motion.div variants={fadeUpItem}>
          <CallToAction />
        </motion.div>
      </AnimatedSection>
    </>
  );
};

export default AboutClient;
