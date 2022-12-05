import { useForm, SubmitHandler, Controller } from "react-hook-form";
import type { TContact } from "../../types/contact";
import { validateUrl } from "../../utils/validation";
import cn from "classnames";

import PhonesFieldController from "./components/PhonesFieldController";
import EmailssFieldController from "./components/EmailsFieldController";
import Addresses from "./components/Addresses";

import { TContactForm } from "./types/contactForm";
import { usePostContact } from "../../utils/api/useCreateContact";
import { useGetTag } from "../../utils/api/useGetTags";

import { TContactReqBody } from "../../utils/api/types/contacts";
import { AiOutlineLoading } from "react-icons/ai";

const emptyContact: TContact = {
  id: Date.now().toString(),
  firstName: "",
  lastName: "",
  phones: [],
  emails: [],
  websiteUrl: "",
  orgName: "",
  addresses: [],
  tags: [],
  notes: "",
};

export default function ContactForm({
  contact = emptyContact,
  existingTags,
  onSubmitSuccess,
}: {
  contact?: TContact;
  existingTags: string[];
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
    watch,
    formState,
  } = useForm<TContactForm>({
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
    data: tags,
    loading: tagsLoading,
    err: tagsErr,
    refetch: fetchTags,
  } = useGetTag();

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

    const concatedPhones = data.phones.concat(data.additionalPhones);
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

    concatedPhones.map((phone) => Number(phone));

    const requestBody: TContactReqBody = {
      firstName: data.firstName,
      lastName: data.lastName,
      phones: concatedPhones.map((phone) => Number(phone)),
      addresses: data.addresses.concat(data.additionalAddresses),
      emails: concatedEmails,
      orgName: data.orgName,
      websiteUrl: data.websiteUrl,
      notes: data.notes,
      tags: data.tags,
    };
    await postContact(requestBody);
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
                        key={tag + "-" + index}
                        onClick={() =>
                          onChange(
                            value?.includes(tag)
                              ? value?.filter((addedTag) => tag !== addedTag)
                              : [...value, tag]
                          )
                        }
                        className={cn(
                          "px-3 py-1 w-fit rounded-md shadow-md cursor-pointer",
                          {
                            "bg-slate-200": !value.includes(tag),
                            "bg-orange-400 text-slate-100": value.includes(tag),
                          }
                        )}
                      >
                        {tag}
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
            defaultValue={getValues("phones")}
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
        <div className="flex flex-col col-span-12">
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

        <div className="flex flex-col col-span-12">
          <label>Notes:</label>
          <textarea
            cols={20}
            rows={4}
            maxLength={200}
            className="resize-none"
            {...register("notes", { maxLength: 200 })}
          ></textarea>
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
