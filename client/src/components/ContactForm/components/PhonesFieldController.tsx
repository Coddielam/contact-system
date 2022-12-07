import { useState } from "react";
import {
  Controller,
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormGetValues,
  FormState,
  UseFormClearErrors,
  useFieldArray,
} from "react-hook-form";
import { AiFillCloseCircle, AiOutlinePlus } from "react-icons/ai";
import type { TContactForm } from "../types/contactForm";
import { phoneRegex } from "../../../utils/regex";
import { v4 as uuidv4 } from "uuid";

export default function PhonesFieldController({
  control,
  register,
  getValues,
  setValue,
  defaultValue,
  formState,
  clearErrors,
}: {
  control: Control<TContactForm>;
  register: UseFormRegister<TContactForm>;
  getValues: UseFormGetValues<TContactForm>;
  setValue: UseFormSetValue<TContactForm>;
  defaultValue: number[];
  formState: FormState<TContactForm>;
  clearErrors: UseFormClearErrors<TContactForm>;
}) {
  const [additionalPhoneFieldsCount, setAdditionalPhoneFieldsCount] =
    useState(0);

  return (
    <div className="w-1/2">
      <Controller
        name="phones"
        control={control}
        defaultValue={defaultValue}
        render={({ field, formState }) => {
          const { value } = field;
          return (
            <>
              {value.map((phone, index) => {
                return (
                  <div
                    key={uuidv4()}
                    className="mb-3 last:mb-0 grid grid-cols-12 items-center"
                  >
                    <span className="col-span-2 font-light">+852</span>
                    <input
                      className="col-span-9"
                      {...register(`phones.${index}`, {
                        pattern: {
                          value: phoneRegex,
                          message: "Invalid format",
                        },
                      })}
                    />
                    {formState.errors.phones &&
                      formState.errors.phones[index] && (
                        <p className="text-error col-span-12">
                          {formState.errors.phones[index]?.message}
                        </p>
                      )}
                    {index > 0 && (
                      <AiFillCloseCircle
                        role="button"
                        className="h-4 w-4 fill-red-500 ml-auto col-span-1"
                        onClick={() => {
                          setValue(
                            `phones`,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            /* @ts-ignore */
                            getValues("phones").filter(
                              (phone, i) => index !== i
                            )
                          );
                        }}
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
            key={uuidv4()}
            className="mb-3 last:mb-0 grid grid-cols-12 items-center"
          >
            <span className="col-span-2 font-light">+852</span>
            <input
              className="col-span-9"
              {...register(`additionalPhones.${index}`, {
                pattern: { value: phoneRegex, message: "Invalid pattern" },
              })}
            />
            <AiFillCloseCircle
              role="button"
              className="h-4 w-4 fill-red-500 ml-auto col-span-1"
              onClick={() => {
                setAdditionalPhoneFieldsCount((state) => state - 1);
                setValue(
                  `additionalPhones`,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  /* @ts-ignore */
                  getValues("additionalPhones").filter(
                    (phone, i) => index !== i
                  )
                );
              }}
            />
            {formState.errors.additionalPhones &&
              formState.errors.additionalPhones[index] && (
                <p className="text-error col-span-12">
                  {formState.errors.additionalPhones[index]?.message}
                </p>
              )}
          </div>
        );
      })}
      <div className="bg-slate-300 px-3 py-1 w-fit rounded-md shadow-sm text-xs">
        <AiOutlinePlus
          role="button"
          onClick={() => {
            clearErrors("phones");
            setAdditionalPhoneFieldsCount((state) => state + 1);
          }}
        />
      </div>
    </div>
  );
}
