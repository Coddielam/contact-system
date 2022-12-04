import { useForm, SubmitHandler, Controller } from "react-hook-form";
import type { TContact } from "../../types/contact";
import { emailRegex, phoneRegex } from "../../utils/regex";
import { validateUrl } from "../../utils/validation";
import cn from "classnames";
import { AiFillCloseCircle, AiOutlinePlus } from "react-icons/ai";
import PhonesFieldController from "./components/PhonesFieldController";
import EmailssFieldController from "./components/EmailsFieldController";
import { TContactForm } from "./types/contactForm";

export default function ContactForm({
  contact,
  existingTags,
}: {
  contact: TContact;
  existingTags: string[];
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<TContactForm>({
    defaultValues: Object.assign(contact, {
      additionalPhones: [],
      additionalEmails: [],
    }),
  });

  const onSubmit: SubmitHandler<TContact> = (data) => console.log(data);

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
          />
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
          />
        </div>

        {/* Addresses */}
        <div className="flex flex-col col-span-12">
          <label>Addresses:</label>
          {contact.addresses.map((address, index) => {
            return (
              <div key={address} className="w-2/3 mb-3 last:mb-0 [&>*]:w-full">
                <input
                  {...register(`addresses.${index}`, { value: address })}
                />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col col-span-3">
          <label>Website URL:</label>
          <input {...register("websiteUrl", { value: contact.websiteUrl })} />
        </div>

        <div className="flex flex-col col-span-12">
          <label>Notes:</label>
          <textarea
            cols={20}
            rows={4}
            maxLength={200}
            className="resize-none"
            {...register("notes")}
          ></textarea>
        </div>

        <div className="mt-5">
          <input type="submit" value="Submit" className="cursor-pointer" />
        </div>
      </form>
    </>
  );
}
