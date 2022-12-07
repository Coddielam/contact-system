import { useState } from "react";
import {
  Controller,
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import { AiFillCloseCircle, AiOutlinePlus } from "react-icons/ai";
import { TAddresses, TAddress } from "../../../types/contact";
import { TContactForm } from "../types/contactForm";

const AddressFields = ({
  register,
  address = {
    _id: "",
    line1: "",
    line2: "",
    line3: "",
    city: "",
    state: "",
    postal: "",
    country: "",
  },
  index,
  registerKey = "addresses",
}: {
  register: UseFormRegister<TContactForm>;
  address?: TAddress;
  index: number;
  registerKey?: "addresses" | "additionalAddresses";
}) => {
  return (
    <>
      <input
        className="col-span-11"
        placeholder="Line 1"
        {...register(`${registerKey}.${index}.line1`, {
          value: address.line1,
        })}
      />
      <input
        className="col-span-11"
        placeholder="Line 2"
        {...register(`${registerKey}.${index}.line2`, {
          value: address.line2,
        })}
      />
      <input
        className="col-span-11"
        placeholder="Line 3"
        {...register(`${registerKey}.${index}.line3`, {
          value: address.line3,
        })}
      />
      <input
        className="col-span-5"
        placeholder="City"
        {...register(`${registerKey}.${index}.city`, {
          value: address.city,
        })}
      />
      <input
        className="col-span-5"
        placeholder="State"
        {...register(`${registerKey}.${index}.state`, {
          value: address.state,
        })}
      />
      <input
        className="col-span-5"
        placeholder="Postal Code"
        {...register(`${registerKey}.${index}.postal`, {
          value: address.postal,
        })}
      />
      <input
        className="col-span-5"
        placeholder="Country"
        {...register(`${registerKey}.${index}.country`, {
          value: address.country,
        })}
      />
    </>
  );
};

export default function AddressesController({
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
  defaultValue: TAddresses;
}) {
  const [additionalAddressFieldsCount, setAdditionalAddressFieldsCount] =
    useState(0);

  return (
    <div className="w-3/4">
      <Controller
        name="addresses"
        control={control}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        defaultValue={defaultValue}
        render={({ field }) => {
          const { value } = field;
          return (
            <>
              {value.map((address, index) => {
                return (
                  <div
                    key={
                      address.line1 + "-" + Date.now().toString() + "-" + index
                    }
                    className="mb-3 last:mb-0 grid grid-cols-12 items-center gap-3"
                  >
                    {index > 0 && <hr className="col-span-12 my-4" />}
                    <AddressFields
                      register={register}
                      index={index}
                      address={address}
                    />
                    {index > 0 && (
                      <AiFillCloseCircle
                        role="button"
                        className="h-4 w-4 fill-red-500 ml-auto col-span-1"
                        onClick={() =>
                          setValue(
                            `addresses`,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            /* @ts-ignore */
                            getValues("addresses").filter(
                              (phone, i) => index !== i
                            )
                          )
                        }
                      />
                    )}
                    {additionalAddressFieldsCount > 0 && (
                      <hr className="col-span-12 my-4" />
                    )}
                  </div>
                );
              })}
            </>
          );
        }}
      />

      {Array.from(Array(additionalAddressFieldsCount).keys()).map(
        (_, index) => {
          return (
            <div
              key={"additional" + "-" + Date.now().toString() + "-" + index}
              className="mb-3 last:mb-0 grid grid-cols-12 items-center gap-3"
            >
              {index > 0 && <hr className="col-span-12 my-4" />}
              <AddressFields
                register={register}
                index={index}
                registerKey="additionalAddresses"
              />
              <AiFillCloseCircle
                role="button"
                className="h-4 w-4 fill-red-500 ml-auto col-span-1"
                onClick={() => {
                  setValue(
                    `additionalAddresses`,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    /* @ts-ignore */
                    getValues("additionalAddresses").filter(
                      (phone, i) => index !== i
                    )
                  );
                  setAdditionalAddressFieldsCount((state) => state - 1);
                }}
              />
            </div>
          );
        }
      )}
      <div className="bg-slate-300 px-3 py-1 w-fit rounded-md shadow-sm text-xs">
        <AiOutlinePlus
          role="button"
          onClick={() => setAdditionalAddressFieldsCount((state) => state + 1)}
        />
      </div>
    </div>
  );
}
