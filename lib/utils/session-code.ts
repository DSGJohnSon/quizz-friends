import { prisma } from "@/lib/prisma";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sans I, O, 0, 1

export async function generateSessionCode(): Promise<string> {
  let code: string;
  let exists = true;

  while (exists) {
    code = Array.from(
      { length: 6 },
      () => CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join("");

    const session = await prisma.gameSession.findUnique({
      where: { code },
    });

    exists = !!session;
  }

  return code!;
}
