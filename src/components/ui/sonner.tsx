import { Toaster as Sonner } from "sonner";
import checkedIcon from "@/assets/toast-iconochecked.png.asset.json";
import alertIcon from "@/assets/toast-iconoalert-02.png.asset.json";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const MaskIcon = ({ src, colorClass }: { src: string; colorClass: string }) => (
  <span
    aria-hidden
    className={`block h-6 w-6 shrink-0 ${colorClass}`}
    style={{
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
    }}
  />
);

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <MaskIcon src={checkedIcon.url} colorClass="bg-salvia" />,
        error: <MaskIcon src={alertIcon.url} colorClass="bg-piedra" />,
        warning: <MaskIcon src={alertIcon.url} colorClass="bg-piedra" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast app-toast",
          icon: "!w-6 !h-6 !m-0 !mr-1",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
