import { avatarHue, getInitials } from "@/lib/utils";

type Props = {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
};

export function Avatar({ name, avatarUrl, size = "md" }: Props) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ring-1 ring-white/10`}
      />
    );
  }

  const hue = avatarHue(name);
  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-full font-semibold text-white ring-1 ring-white/10`}
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 45% 38%), hsl(${hue} 50% 22%))`,
      }}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
