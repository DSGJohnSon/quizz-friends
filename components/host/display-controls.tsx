"use client";

import { useEffect, useState } from "react";
import {
  DisplayState,
  DisplayTarget,
  DisplayAction,
} from "@/domain/display/display.types";
import { Monitor, CreditCard, QrCode, Laptop2 } from "lucide-react";

interface DisplayControlsProps {
  sessionId: string;
  currentDisplayState: DisplayState;
}

const HEARTBEAT_TIMEOUT = 10000; // 10 secondes sans heartbeat = déconnecté

export function DisplayControls({
  sessionId,
  currentDisplayState,
}: DisplayControlsProps) {
  // On utilise directement la prop currentDisplayState qui vient du parent (mis à jour par polling + realtime)
  // Plus besoin de state local complexe ici qui risque de diverger pour le heartbeat
  const displayState = currentDisplayState;

  const [now, setNow] = useState(Date.now());
  const [showModal, setShowModal] = useState(false);
  const [pendingActionType, setPendingActionType] = useState<
    DisplayAction["type"] | null
  >(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (
    target: "display1" | "display2",
    currentTime: number = now
  ) => {
    const last = displayState[target]?.lastHeartbeat;
    if (!last) return "offline";
    return currentTime - last < HEARTBEAT_TIMEOUT ? "online" : "offline";
  };

  const isD2Available = getStatus("display2", now) === "online";

  const getStatusColor = (status: "online" | "offline") => {
    return status === "online" ? "bg-green-500" : "bg-red-500";
  };

  const handleActionClick = (type: DisplayAction["type"]) => {
    setPendingActionType(type);
    setShowModal(true);
  };

  const sendAction = async (target: DisplayTarget) => {
    if (!pendingActionType) return;

    try {
      await fetch(`/api/sessions/${sessionId}/display`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: { type: pendingActionType, target },
          isDisplay2Available: isD2Available,
        }),
      });
      setShowModal(false);
      setPendingActionType(null);
    } catch (error) {
      console.error("Failed to send action", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Monitor className="w-6 h-6 text-purple-600" />
          Régie Écrans
        </h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor(
                getStatus("display1", now)
              )}`}
            />
            <span>Display 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor(
                getStatus("display2", now)
              )}`}
            />
            <span className={!isD2Available ? "opacity-50" : ""}>
              Display 2
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ActionButton
          icon={<QrCode />}
          label="Infos Connexion"
          onClick={() => handleActionClick("SHOW_LOBBY")}
          isActive={
            displayState.display1.view.type === "LOBBY" ||
            displayState.display2.view.type === "LOBBY"
          }
        />
        <ActionButton
          icon={<CreditCard />}
          label="Scoreboard"
          onClick={() => handleActionClick("SHOW_SCOREBOARD")}
          isActive={
            displayState.display1.view.type === "SCOREBOARD" ||
            displayState.display2.view.type === "SCOREBOARD"
          }
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">
              Choisir l&apos;écran cible
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => sendAction("AUTO")}
                className="p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-500 flex items-center justify-between group transition-colors"
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-purple-700">
                    AUTO (Vers{" "}
                    {pendingActionType === "SHOW_LOBBY"
                      ? "Display 1"
                      : isD2Available
                      ? "Display 2"
                      : "Display 1"}
                    )
                  </span>
                  <span className="text-sm text-gray-500">
                    {pendingActionType === "SHOW_LOBBY"
                      ? "Toujours sur l'écran principal"
                      : isD2Available
                      ? "Utilise l'écran secondaire disponible"
                      : "Repli sur l'écran principal (D2 absent)"}
                  </span>
                </div>
                <Laptop2 className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
              </button>

              <div className="border-t my-2"></div>

              <button
                onClick={() => sendAction("DISPLAY_1")}
                className="p-3 border rounded-lg hover:bg-gray-50 flex items-center gap-3 text-left"
              >
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor(
                    getStatus("display1", now)
                  )}`}
                />
                <span>Forcer sur Display 1</span>
              </button>
              <button
                onClick={() => sendAction("DISPLAY_2")}
                disabled={!isD2Available}
                className="p-3 border rounded-lg hover:bg-gray-50 flex items-center gap-3 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor(
                    getStatus("display2", now)
                  )}`}
                />
                <span>Forcer sur Display 2</span>
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-2 text-gray-500 hover:text-gray-700 font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  isActive,
}: {
  icon: any;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-lg bordertransition-all duration-200 border
        ${
          isActive
            ? "bg-purple-100 border-purple-500 text-purple-700 ring-2 ring-purple-500/20"
            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-white hover:border-purple-300 hover:shadow-sm"
        }`}
    >
      <div className="mb-2">{icon}</div>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}
