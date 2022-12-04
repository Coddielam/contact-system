import { useState } from "react";
import {
  Controller,
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import { AiFillCloseCircle, AiOutlinePlus } from "react-icons/ai";
import type { TContactForm } from "../types/contactForm";

export default function PhonesFieldController({
  control,
  register,
  getValues,
  setValue,
  defaultValue,
}: {
  control: Control<TContactForm>;
  register: UseFormRegister<TContactForm>;
  getValues: UseFormGetValues<TContactForm>;
  setValue: UseFormSetValue<TContactForm>;
  defaultValue: number[];
}) {
  const [additionalPhoneFieldsCount, setAdditionalPhoneFieldsCount] =
    useState(0);

  return (
    <div className="w-1/2">
      <Controller
        name="phones"
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => {
          const { value } = field;
          return (
            <>
              {value.map((phone, index) => {
                return (
                  <div
                    key={phone + "-" + Date.now().toString() + "-" + index}
                    className="mb-3 last:mb-0 grid grid-cols-12 items-center"
                  >
                    <span className="col-span-2 font-light">+852</span>
                    <input
                      className="col-span-9"
                      {...register(`phones.${index}`, {
                        value: phone,
                        valueAsNumber: true,
                      })}
                    />
                    {index > 0 && (
                      <AiFillCloseCircle
                        role="button"
                        className="h-4 w-4 fill-red-500 ml-auto col-span-1"
                        onClick={() =>
                          setValue(
                            `phones`,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            /* @ts-ignore */
                            getValues("phones").filter(
                              (phone, i) => index !== i
                            )
                          )
                        }
                      />
                    )}
                  </div>
                );
              })}
            </>
          );
        }}
      />
      {Array.from(Array(additionalPhoneFieldsCount).keys()).map((_, index) => {
        return (
          <div
            key={"additional" + "-" + Date.now().toString() + "-" + index}
            className="mb-3 last:mb-0 grid grid-cols-12 items-center"
          >
            <span className="col-span-2 font-light">+852</span>
            <input
              className="col-span-9"
              {...register(`additionalPhones.${index}`, {})}
            />
            <AiFillCloseCircle
              role="button"
              className="h-4 w-4 fill-red-500 ml-auto col-span-1"
              onClick={() =>
                setValue(
                  `additionalPhones`,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  /* @ts-ignore */
                  getValues("additionalPhones").filter(
                    (phone, i) => index !== i
                  )
                )
              }
            />
          </div>
        );
      })}
      <div className="bg-slate-300 px-3 py-1 w-fit rounded-md shadow-sm text-xs">
        <AiOutlinePlus
          role="button"
          onClick={() => setAdditionalPhoneFieldsCount((state) => state + 1)}
        />
      </div>
    </div>
  );
}
