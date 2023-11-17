import type { ComponentProps } from "react";
import { useState, useCallback, forwardRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { getFormData } from "@/utilities";
import { contactSchema } from "@/schema/contact";

interface InputFieldProps extends ComponentProps<"input"> {
  className?: string;
}

interface TextareaProps extends ComponentProps<"textarea"> {
  className?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={`flex h-10 border-b \
    bg-[transparent] px-3 py-2 text-sm \
    ring-offset-background \
    placeholder:text-muted-foreground placeholder:text-lg \
    file:border-0 file:bg-transparent file:text-sm file:font-medium \
    focus-visible:outline-none focus-visible:ring-2 \
    focus-visible:ring-ring focus-visible:ring-offset-2 \
    disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
      {...props}
    />
  )
);

const TextAreaField = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={`flex text-sm h-auto border-b \
        bg-[transparent] px-3 py-2  ml-3 \
        ring-offset-background \
        placeholder:text-muted-foreground placeholder:text-lg \
        file:border-0 file:bg-transparent file:text-sm file:font-medium \
        focus-visible:outline-none focus-visible:ring-2 \
        focus-visible:ring-ring focus-visible:ring-offset-2 \
        disabled:cursor-not-allowed disabled:opacity-50 resize-y ${
          className ?? ""
        }`}
      {...props}
    ></textarea>
  )
);

export default function Contact() {
  const [responseMessage, setResponseMessage] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    mode: "onSubmit",
  });

  const onSubmit = useCallback(
    handleSubmit(async (data) => {
      const formData = getFormData(data);
      const responseBody = await fetch("/api/contact-form", {
        method: "POST",
        body: formData,
      });
      const response = await responseBody.json();
      if (response.message) {
        setResponseMessage(response.message);
      }
    }),
    [handleSubmit]
  );

  return (
    <form
      id="contact"
      className="w-screen flex flex-col justify-center min-h-screen p-8 md:p-16 lg:p-24 relative"
      onSubmit={onSubmit}
    >
      <div className="flex flex-wrap">
        <div className="flex">
          <p className="overflow-hidden whitespace-nowrap ml-3">Hello! It's</p>{" "}
          <InputField
            placeholder="Elon Musk"
            className="w-[20ch]"
            {...register("name")}
          />
        </div>

        <div className="flex">
          <p className="overflow-hidden whitespace-nowrap ml-3">I'm</p>{" "}
          <InputField
            placeholder="CEO & Founder"
            className="w-[25ch]"
            {...register("title")}
          />
        </div>
        <div className="flex">
          <p className="overflow-hidden whitespace-nowrap ml-3">at</p>{" "}
          <InputField
            placeholder="Tesla"
            className="w-[20ch]"
            {...register("company")}
          />
          {"."}
        </div>
        <div className="flex flex-wrap w-full my-6">
          <p className="overflow-hidden whitespace-nowrap ml-3">
            And I'm looking to
          </p>{" "}
          <TextAreaField
            placeholder="create a mind-blowing landing/marketing site for CyberTruck"
            className="min-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl"
            {...register("description")}
          />
        </div>

        <div className="flex">
          <p className="overflow-hidden whitespace-nowrap ml-3">within</p>{" "}
          <InputField
            placeholder="3 days"
            className="w-[10ch]"
            {...register("deadline")}
          />
        </div>

        <div className="flex flex-wrap">
          <p className="ml-3">with the budget of&nbsp;</p>

          <InputField
            type="number"
            placeholder="1B"
            className="relative sm:max-w-[5ch] lg:max-w-[20ch]"
            {...register("budget")}
          />
          <p className="overflow-hidden whitespace-nowrap">{"USD."}</p>
        </div>

        <div className="flex flex-wrap mt-6 md:mt-0">
          <p className="ml-3">Here's my</p>

          <InputField
            type="email"
            placeholder="email"
            className="relative sm:max-w-[5ch] lg:max-w-[20ch]"
            {...register("email")}
          />
          <p className="overflow-hidden whitespace-nowrap">
            {"let's talk soon!"}
          </p>
        </div>
      </div>

      <div className="flex w-full justify-center items-center">
        <button
          type="submit"
          className="w-max text-6xl font-black mt-16 lg:mt-36 link-underline"
        >
          Let's talk? 🚀
        </button>
      </div>
    </form>
  );
}
