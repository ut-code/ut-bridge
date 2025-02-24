"use client";
import type { User } from "@/app/(auth)/users/page";
import { useState } from "react";
import { AppIcon } from "./AppIcon";

type Props = {
  name: string | null;
  imageUrl: string | null;
  campus: string | null;
  fluentLanguages: string[];
  learningLanguages: string[];
};

export default function Card(props: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <>
      <div className="border-4 border-white rounded-2xl p-4 bg-white justify-center flex flex-wrap">
        <div className="text-black w-1/2">
          <AppIcon width={100} height={100} />
        </div>
        <div className="text-black w-1/2">
          <h2>
            {`${props.name} `}
            <button
              type="button"
              className="text-black"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              {isFavorite ? "⭐" : "☆"}
            </button>
          </h2>
          <p className="text-sm">{props.campus}</p>
          <p>
            <div className="badge badge-success p-2">✔</div>
            <span className="text-sm">{props.fluentLanguages}</span>
          </p>
          <p>
            <div className="badge badge-warning p-2">❓</div>
            <span className="text-sm">{props.learningLanguages}</span>
          </p>
        </div>
      </div>
    </>
  );
}
