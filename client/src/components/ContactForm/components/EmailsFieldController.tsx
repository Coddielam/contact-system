import { useState } from "react";
import {
  Controller,
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormGetValues,
  FormState,
  UseFormClearErrors,
} from "react-hook-form";
import { AiFillCloseCircle, AiOutlinePlus } from "react-icons/ai";
import { TContactForm } from "../types/contactForm";
import { emailRegex } from "../../../utils/regex";

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
  defaultValue: string[];
  formState: FormState<TContactForm>;
  clearErrors: UseFormClearErrors<TContactForm>;
}) {
  const [additionalEmailFieldsCount, setAdditionalEmailFieldsCount] =
    useState(0);

  return (
    <div className="w-1/2">
      <Controller
        name="emails"
        control={control}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
                    <input
                      className="col-span-11"
                      {...register(`emails.${index}`, {
                        value: phone,
                        pattern: emailRegex,
                      })}
                    />
                    {index > 0 && (
                      <AiFillCloseCircle
                        role="button"
                        className="h-4 w-4 fill-red-500 ml-auto col-span-1"
                        onClick={() => {
                          setValue(
                            `emails`,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            /* @ts-ignore */
                            getValues("emails").filter(
                              (phone, i) => index !== i
                            )
                          );
                        }}
                      />
                    )}
                    {formState.errors.emails &&
                      formState.errors.emails[index] && (
                        <p className="text-error col-span-12">
                          Invalid email format
                        </p>
                      )}
                  </div>
                );
              })}
            </>
          );
        }}
      />

      {Array.from(Array(additionalEmailFieldsCount).keys()).map((_, index) => {
        return (
          <div
            key={"additional" + "-" + Date.now().toString() + "-" + index}
            className="mb-3 last:mb-0 grid grid-cols-12 items-center"
          >
            <input
              className="col-span-11"
              {...register(`additionalEmails.${index}`, {
                pattern: emailRegex,
              })}
            />
            <AiFillCloseCircle
              role="button"
              className="h-4 w-4 fill-red-500 ml-auto col-span-1"
              onClick={() => {
                setAdditionalEmailFieldsCount((state) => state - 1);
                setValue(
                  `additionalEmails`,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  /* @ts-ignore */
                  getValues("additionalEmails").filter(
                    (phone, i) => index !== i
                  )
                );
              }}
            />
            {formState.errors.additionalEmails &&
              formState.errors.additionalEmails[index] && (
                <p className="text-error col-span-12">Invalid email format</p>
              )}
          </div>
        );
      })}
      <div className="bg-slate-300 px-3 py-1 w-fit rounded-md shadow-sm text-xs">
        <AiOutlinePlus
          role="button"
          onClick={() => {
            clearErrors("emails");
            setAdditionalEmailFieldsCount((state) => state + 1);
          }}
        />
      </div>
    </div>
  );
}
