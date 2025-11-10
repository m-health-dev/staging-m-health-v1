import {
  ArrowUpRight,
  Calendar,
  Map,
  MapPin,
  PencilLine,
  Pin,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import LocalDateTime from "../utility/lang/LocaleDateTime";
import Link from "next/link";
import { Button } from "../ui/button";

const CurrentEventsGrid = ({ data }: { data: any[] }) => {
  const currated = data.slice(0, 4);
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
      {currated.map((e, i) => (
        <div
          className="grid md:grid-cols-3 grid-cols-1 items-center bg-white border rounded-2xl group hover:outline-2 hover:outline-primary transition-all duration-100 cursor-pointer"
          key={e.id}
        >
          <div className="col-span-1">
            <Image
              src={e.full}
              alt={e.alt}
              width={500}
              height={500}
              className="w-full h-full aspect-square object-cover rounded-2xl"
            />
          </div>
          <div className="col-span-2 p-4">
            <h5 className="capitalize font-bold text-primary line-clamp-2">
              {e.alt}
            </h5>
            <div className="mt-2 mb-3">
              <div className="events_location flex gap-2 items-center">
                <MapPin className="size-4" />
                <p className="text-muted-foreground">
                  {e.location || "Indonesia"}
                </p>
              </div>
              <div className="events_location flex gap-2 items-center">
                <Calendar className="size-4" />
                <p className="text-muted-foreground">
                  <LocalDateTime date={e.created_at} />
                </p>
              </div>
            </div>
            {i % 2 === 0 ? (
              <Link href={e.url}>
                <Button
                  className="text-base rounded-full lg:w-fit w-full lg:h-10 h-14 font-medium cursor-pointer"
                  size={"lg"}
                >
                  <ArrowUpRight /> Register to this Event
                </Button>
              </Link>
            ) : (
              <p className="bg-gray-100 inline-flex py-2 px-4 rounded-full lg:w-fit w-full lg:h-10 h-14 text-muted-foreground font-medium items-center gap-3 justify-center">
                <PencilLine className="size-4" /> On Site Registration
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CurrentEventsGrid;
