import { toast, ToastOptions } from "react-toastify";

export default function useReload(
  {
    shouldToast = true,
    toastOptions,
  }: {
    shouldToast?: boolean;
    toastOptions?: ToastOptions;
  } = { shouldToast: true, toastOptions: {} }
) {
  const toaster = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    toast: shouldToast
      ? (message = "Success", config: ToastOptions = {}) => {
          toast.success(message, {
            ...toastOptions,
            ...config,
            autoClose: 3000,
          });
          const timeout = setTimeout(() => {
            window.location.reload();
            clearTimeout(timeout);
          }, 3000);
        }
      : // eslint-disable-next-line no-empty-pattern
        (message = "Success", config: ToastOptions = {}) => {
          // toast(message, { autoClose: 0 });
          window.location.reload();
        },
  };
  return { toaster };
}
