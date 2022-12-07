import { useForm, SubmitHandler, Controller } from "react-hook-form";
import type { TContact } from "../../types/contact";
import { validateUrl } from "../../utils/validation";
import cn from "classnames";
import PhonesFieldController from "./components/PhonesFieldController";
import EmailssFieldController from "./components/EmailsFieldController";
import Addresses from "./components/Addresses";
import { TContactForm } from "./types/contactForm";
import { usePostContact } from "../../utils/api/useCreateContact";
import { usePatchUpdateContact } from "../../utils/api/useUpdateContact";
import { useGetTag } from "../../utils/api/useGetTags";
import { TContactReqBody } from "../../utils/api/types/contacts";
import { AiOutlineLoading, AiOutlinePlus } from "react-icons/ai";
import { TTag } from "../../utils/api/types/tags";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { phoneRegex } from "../../utils/regex";

const emptyContact: TContact = {
  _id: "",
  firstName: "",
  lastName: "",
  phones: [],
  emails: [],
  websiteUrl: "",
  orgName: "",
  addresses: [],
  tags: [],
  notes: "",
  customs: [],
  additionalPhones: [],
  additionalEmails: [],
  additionalAddresses: [],
};

export default function ContactForm({
  contact = emptyContact,
  existingTags,
  onSubmitSuccess,
}: {
  contact?: TContact | TContact;
  existingTags: TTag[];
  onSubmitSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    clearErrors,
    trigger,
    watch,
    formState,
  } = useForm<TContactForm>({
    mode: "onBlur",
    defaultValues: Object.assign(contact, {
      additionalPhones: [],
      additionalEmails: [],
      additionalAddresses: [],
    }),
  });

  const { errors } = formState;

  const {
    data,
    loading: postContactLoading,
    err,
    refetch: postContact,
  } = usePostContact();

  const {
    data: patchContactData,
    loading: patchUserLoading,
    err: patchContactErr,
    refetch: patchContact,
  } = usePatchUpdateContact(contact._id);

  const {
    data: tags,
    loading: tagsLoading,
    err: tagsErr,
    refetch: fetchTags,
  } = useGetTag();

  const [customFields, setCustomFields] = useState<
    { id: string; label: string; value: string }[]
  >([]);

  const onSubmit: SubmitHandler<TContact> = async (data) => {
    if (data.websiteUrl) {
      const valid = validateUrl(data.websiteUrl);
      if (!valid) {
        setError("websiteUrl", {
          type: "custom",
          message: "URL is invalid; Example format: https://www.google.com",
        });
        return;
      }
    }

    const concatedPhones = data.phones
      .concat(data.additionalPhones)
      .filter((e) => e);
    if (!concatedPhones.length) {
      setError("phones", {
        type: "custom",
        message: "Please add at least 1 phone number",
      });
      return;
    }

    const concatedEmails = data.emails.concat(data.additionalEmails);
    if (!concatedEmails.length) {
      setError("emails", {
        type: "custom",
        message: "Please add at least 1 email",
      });
      return;
    }

    const requestBody: TContactReqBody = {
      firstName: data.firstName,
      lastName: data.lastName,
      phones: concatedPhones.map((phone) => Number(phone)).filter((e) => e),
      addresses: data.addresses.concat(data.additionalAddresses),
      emails: concatedEmails.filter((e) => e),
      orgName: data.orgName,
      websiteUrl: data.websiteUrl,
      notes: data.notes,
      tags: data.tags,
      customs: data.customs
        .map(({ label, value }) => ({ label, value }))
        .concat(customFields.map(({ label, value }) => ({ label, value })))
        .filter((e) => e.label && e.value),
    };

    const phonesValid = data.phones.every((p) => phoneRegex.test(p.toString()));
    // FIX: weird phone validation error
    if (!phonesValid) {
      setError("phones", { message: "Please check format" });
      return;
    }

    await (contact._id ? patchContact : postContact)(requestBody);
    const successTimeout = setTimeout(() => {
      onSubmitSuccess();
      clearTimeout(successTimeout);
    }, 500);
  };

  return (
    <>
      <h1>Update Contact:</h1>
      <form
        className="grid grid-cols-12 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* First name */}
        <div className="flex flex-col col-span-4">
          <label>First name:</label>
          <input
            {...register("firstName", {
              required: "First name is required",
              value: contact.firstName,
            })}
          />
          {errors.firstName && (
            <p className="text-error">First name is required</p>
          )}
        </div>
        {/* Last name */}
        <div className="flex flex-col col-span-4">
          <label>Last name:</label>
          <input
            {...register("lastName", {
              required: "Last name is required",
              value: contact.lastName,
            })}
          />
          {errors.firstName && (
            <p className="text-error">Last name is required</p>
          )}
        </div>
        {/* Tags */}
        <div className="flex flex-col col-span-4">
          <label>Tags:</label>
          {/* { contact.tags.map(tag => ) } */}
          <Controller
            name="tags"
            control={control}
            defaultValue={getValues("tags")}
            render={({ field }) => {
              const { value, onChange } = field;
              return (
                <div className="flex flex-wrap gap-2">
                  {existingTags.map((tag, index) => {
                    return (
                      <span
                        key={tag._id}
                        onClick={() =>
                          onChange(
                            value?.find((e) => e._id === tag._id)
                              ? value?.filter(
                                  (addedTag) => tag._id !== addedTag._id
                                )
                              : [...value, tag]
                          )
                        }
                        className={cn(
                          "px-3 py-1 w-fit rounded-md shadow-md cursor-pointer",
                          {
                            "bg-slate-200": !value.find(
                              (e) => e._id === tag._id
                            ),
                            "bg-orange-400 text-slate-100": value.find(
                              (e) => e._id === tag._id
                            ),
                          }
                        )}
                      >
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
              );
            }}
          />
        </div>

        {/* organizaion */}
        <div className="flex flex-col col-span-6">
          <label>Organization:</label>
          <input {...register("orgName", { value: contact.orgName })} />
        </div>
        <div className="col-span-6"></div>

        {/* Phones */}
        <div className="flex flex-col col-span-12">
          <label>Phones:</label>
          <PhonesFieldController
            control={control}
            register={register}
            getValues={getValues}
            setValue={setValue}
            defaultValue={contact.phones}
            formState={formState}
            clearErrors={clearErrors}
          />
          {errors.phones && (
            <p className="text-error">{errors.phones.message}</p>
          )}
        </div>

        {/* Emails */}
        <div className="flex flex-col col-span-12">
          <label>Emails:</label>
          <EmailssFieldController
            control={control}
            register={register}
            getValues={getValues}
            setValue={setValue}
            defaultValue={getValues("emails")}
            formState={formState}
            clearErrors={clearErrors}
          />
          {errors.emails && (
            <p className="text-error">{errors.emails.message}</p>
          )}
        </div>

        {/* Addresses */}
        <div className="flex flex-col col-span-12">
          <label>Addresses:</label>
          <Addresses
            control={control}
            register={register}
            getValues={getValues}
            setValue={setValue}
            defaultValue={getValues("addresses")}
          />
          {errors.addresses && (
            <p className="text-error">{errors.addresses.message}</p>
          )}
        </div>

        {/* Website URL */}
        <div className="flex flex-col col-span-6">
          <label>Website URL:</label>
          <input
            {...register("websiteUrl", {
              value: contact.websiteUrl,
            })}
          />
          {errors.websiteUrl && (
            <p className="text-error">{errors.websiteUrl.message}</p>
          )}
        </div>

        {/* Notes */}
        <div className="flex flex-col col-span-12">
          <label>Notes:</label>
          <textarea
            cols={20}
            rows={4}
            maxLength={200}
            className="resize-none w-3/4"
            {...register("notes", { maxLength: 200 })}
          ></textarea>
        </div>

        {/* custom fields */}
        <div className="flex flex-col col-span-12">
          <label>Custom fields:</label>
          {contact.customs.map((customF, index) => {
            return (
              <div className="mb-4" key={customF._id}>
                <input
                  type="text"
                  className="mr-3"
                  {...register(`customs.${index}.label`)}
                />
                <input type="text" {...register(`customs.${index}.value`)} />
              </div>
            );
          })}
          {customFields.map((customF) => {
            return (
              <div key={customF.id} className="mb-4">
                <input
                  type="text"
                  className="mr-3"
                  placeholder="Label"
                  value={customF.label}
                  onChange={(e) =>
                    setCustomFields((state) =>
                      state.map((field) =>
                        field.id === customF.id
                          ? { ...field, label: e.target.value }
                          : field
                      )
                    )
                  }
                />
                <input
                  type="text"
                  value={customF.value}
                  placeholder="Value"
                  onChange={(e) =>
                    setCustomFields((state) =>
                      state.map((field) =>
                        field.id === customF.id
                          ? { ...field, value: e.target.value }
                          : field
                      )
                    )
                  }
                />
              </div>
            );
          })}
          <div
            className="bg-slate-300 px-3 py-1 w-fit rounded-md shadow-sm text-xs"
            role="button"
            onClick={() =>
              setCustomFields((state) => [
                ...state,
                { id: uuidv4(), label: "", value: "" },
              ])
            }
          >
            <AiOutlinePlus />
          </div>
        </div>

        <div className="mt-5 bg-orange-400 px-3 py-2 flex justify-center w-24 h-[40px] items-center shadow-md rounded-md">
          {postContactLoading && (
            <div>
              <AiOutlineLoading className="animate-spin" />
            </div>
          )}
          {!postContactLoading && (
            <input
              type="submit"
              value={postContactLoading ? "Loading" : "Submit"}
              className="cursor-pointer"
            />
          )}
        </div>
      </form>
    </>
  );
}
