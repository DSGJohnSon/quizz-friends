import { prisma } from "@/lib/prisma";
import {
  DisplayAction,
  DisplayState,
  DisplayView,
  DisplayTarget,
} from "./display.types";

const DEFAULT_STATE: DisplayState = {
  display1: { view: { type: "EMPTY" } },
  display2: { view: { type: "EMPTY" } },
};

export async function getDisplayState(
  sessionId: string
): Promise<DisplayState> {
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    select: { displayState: true },
  });

  if (!session?.displayState) {
    return DEFAULT_STATE;
  }

  const state = session.displayState as unknown as DisplayState;
  return {
    display1: { ...DEFAULT_STATE.display1, ...state.display1 },
    display2: { ...DEFAULT_STATE.display2, ...state.display2 },
  };
}

export async function updateDisplayHeartbeat(
  sessionId: string,
  displayTarget: "DISPLAY_1" | "DISPLAY_2"
): Promise<void> {
  const currentState = await getDisplayState(sessionId);
  const now = Date.now();

  const newState = { ...currentState };
  if (displayTarget === "DISPLAY_1") {
    newState.display1.lastHeartbeat = now;
  } else {
    newState.display2.lastHeartbeat = now;
  }

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: { displayState: newState as any },
  });
}

export async function updateDisplayState(
  sessionId: string,
  action: DisplayAction,
  isDisplay2Available: boolean
): Promise<DisplayState> {
  const currentState = await getDisplayState(sessionId);
  let newState: DisplayState = JSON.parse(JSON.stringify(currentState));

  // 1. Résoudre la vue demandée
  const requestedView = resolveViewFromAction(action);
  const target = resolveTarget(action.target, action.type, isDisplay2Available);

  // 2. Appliquer la logique Toggle
  // Si la vue actuelle sur la cible est DÉJÀ celle demandée -> On passe en EMPTY
  // Sinon -> On applique la nouvelle vue
  if (target === "DISPLAY_1") {
    if (newState.display1.view.type === requestedView.type) {
      newState.display1.view = { type: "EMPTY" };
    } else {
      newState.display1.view = requestedView;
    }
  } else {
    if (newState.display2.view.type === requestedView.type) {
      newState.display2.view = { type: "EMPTY" };
    } else {
      newState.display2.view = requestedView;
    }
  }

  await prisma.gameSession.update({
    where: { id: sessionId },
    data: { displayState: newState as any },
  });

  return newState;
}

function resolveViewFromAction(action: DisplayAction): DisplayView {
  switch (action.type) {
    case "SHOW_LOBBY":
      return { type: "LOBBY" };
    case "SHOW_SCOREBOARD":
      return { type: "SCOREBOARD" };
    default:
      return { type: "EMPTY" };
  }
}

function resolveTarget(
  targetRequest: DisplayTarget | undefined,
  actionType: DisplayAction["type"],
  isDisplay2Available: boolean
): "DISPLAY_1" | "DISPLAY_2" {
  // Si cible manuelle, on respecte
  if (targetRequest === "DISPLAY_1") return "DISPLAY_1";
  if (targetRequest === "DISPLAY_2") return "DISPLAY_2";

  // Logique AUTO
  if (actionType === "SHOW_LOBBY") {
    // Infos connexion toujours sur D1 auto
    return "DISPLAY_1";
  }

  if (actionType === "SHOW_SCOREBOARD") {
    // Scoreboard sur D2 si dispo, sinon D1
    return isDisplay2Available ? "DISPLAY_2" : "DISPLAY_1";
  }

  return "DISPLAY_1";
}
