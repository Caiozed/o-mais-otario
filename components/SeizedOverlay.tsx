/** Full-viewport prank overlay — covers the entire app. */
export function SeizedOverlay() {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black"
      aria-hidden
      style={{
        backgroundImage: "url(/seized.png)",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
