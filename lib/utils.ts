/** Digits only, with Brazil country code when missing. */
export function normalizePhone(phone: string | null | undefined) {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  if (digits.length >= 10 && digits.length <= 11) return `55${digits}`;
  return digits;
}

/** Build emoji from code points so file encoding never breaks WhatsApp text. */
function emoji(...codes: number[]) {
  return String.fromCodePoint(...codes);
}

export function whatsappDeclareUrl(friend: {
  name: string;
  phone: string | null;
  score: number;
}) {
  const phone = normalizePhone(friend.phone);
  if (!phone) return null;

  const siren = emoji(0x1f6a8);
  const clown = emoji(0x1f921);
  const fire = emoji(0x1f525);
  const megaphone = emoji(0x1f4e2);
  const crown = emoji(0x1f451);
  const poop = emoji(0x1f4a9);
  const chart = emoji(0x1f4ca);
  const trophy = emoji(0x1f3c6);
  const brain = emoji(0x1f9e0);
  const pin = emoji(0x1f4cc);
  const speaker = emoji(0x1f4e3);
  const pen = emoji(0x270d, 0xfe0f);
  const devil = emoji(0x1f608);
  const skull = emoji(0x1f480);
  const tag = friend.name.replace(/\s+/g, "");

  const text = [
    `${siren}${clown}${fire} *ALERTA DE OT\u00c1RIO DETECTADO* ${fire}${clown}${siren}`,
    ``,
    `${megaphone} Aten\u00e7\u00e3o, grupinho de degenerados:`,
    ``,
    `${crown}${poop} *${friend.name}* acabou de ser COROADO(A) *O MAIS OT\u00c1RIO* do ranking.`,
    ``,
    `${chart} Placar oficial: *${friend.score} pts* de canalhice pura.`,
    `${trophy} T\u00edtulo: L\u00edder Absoluto da Tramboia / Vergonha Alheia Suprema.`,
    `${brain} Status cerebral: *desaparecido sem rastros*.`,
    `${clown} N\u00edvel de vergonha: *internacional*.`,
    ``,
    `${pin} Que sirva de exemplo: assim n\u00e3o se faz, assim se vira meme.`,
    `${speaker} Pode printar, zoar e nunca esquecer.`,
    ``,
    `${pen} Assinado com desprezo carinhoso:`,
    `${devil} *A elei\u00e7\u00e3o mensal das piores traquinagens* ${devil}`,
    `${skull} #OMaisOtario #VergonhaAlheia #${tag}Otario`,
  ].join("\n");

  // api.whatsapp.com + URLSearchParams keeps UTF-8 emoji encoding intact
  const params = new URLSearchParams();
  params.set("phone", phone);
  params.set("text", text);
  return `https://api.whatsapp.com/send?${params.toString()}`;
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function avatarHue(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function formatRelativeTime(iso: string) {
  const date = new Date(iso.endsWith("Z") ? iso : `${iso.replace(" ", "T")}Z`);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
