import { useState } from "react";
import { GameSession, Player } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Users,
  LayoutDashboard,
  ChevronsUp,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";
import { PlayerList } from "./player-list";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import BgAnimated from "../bg-animated";

type SessionWithPlayers = GameSession & { players: Player[] };

interface HostLayoutProps {
  session: SessionWithPlayers;
  children: React.ReactNode;
  alerts: { id: string; message: string; type: "join" | "leave" }[];
  onAlertDismiss: (id: string) => void;
}

const InfoContent = ({ session }: { session: SessionWithPlayers }) => (
  <div className="h-full flex flex-col">
    <div className="hidden lg:block p-4 bg-gray-50 rounded-lg mb-6">
      <h3 className="text-sm font-medium text-gray-500 mb-1">
        Informations Session
      </h3>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{session.title}</h2>
      <div className="flex items-center gap-4">
        <div className="bg-white px-3 py-1 rounded border border-gray-200">
          <span className="text-xs text-gray-500 block">Code</span>
          <span className="font-mono font-bold text-lg text-indigo-600">
            {session.code}
          </span>
        </div>
        <div className="bg-white px-3 py-1 rounded border border-gray-200">
          <span className="text-xs text-gray-500 block">Status</span>
          <span className="font-medium text-gray-900">{session.status}</span>
        </div>
      </div>
    </div>

    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <PlayerList players={session.players} />
      </div>
    </div>
  </div>
);

export function HostLayout({
  session,
  children,
  alerts,
  onAlertDismiss,
}: HostLayoutProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="min-h-screen w-screen p-6 lg:p-12 lg:pr-24 pb-32 lg:pb-6 relative">
      {/* Header Minimaliste */}
      <div className="absolute top-0 left-0 flex items-center justify-between mb-8 max-w-6xl mx-auto">
        {isDesktop ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="fixed right-0 top-12 px-5 h-64 rounded-r-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 flex items-center gap-4">
                  <ChevronsUp className="w-4 h-4" />
                  <div className="flex items-center gap-1">
                    <span className="text-nowrap">Infos & Joueurs</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {session.players?.length || 0}
                    </span>
                  </div>
                  <ChevronsUp className="w-4 h-4" />
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-[50vw] w-[50vw] p-8">
              <SheetHeader className="mb-4">
                <SheetTitle>Détails de la session</SheetTitle>
              </SheetHeader>
              <InfoContent session={session} />
            </SheetContent>
          </Sheet>
        ) : (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-8 fixed bottom-0 w-full rounded-b-none py-8"
              >
                <ChevronsUp className="w-4 h-4" />
                <div className="flex items-center gap-2">
                  Scores & Joueurs
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {session.players?.length || 0}
                  </span>
                </div>
                <ChevronsUp className="w-4 h-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh]">
              <DrawerHeader className="text-left">
                <DrawerTitle>
                  Session Status :{" "}
                  <span className="bg-gray-200 border border-gray-300 px-2 rounded-sm ml-1">
                    {session.status}
                  </span>
                </DrawerTitle>
              </DrawerHeader>
              <div className="p-4 h-full">
                <InfoContent session={session} />
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>

      {/* Main Content */}
      <div>{children}</div>

      {/* Alerts */}
      <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2 pointer-events-none">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`pointer-events-auto p-4 rounded-lg shadow-lg border-l-4 flex items-center justify-between min-w-[300px] animate-in slide-in-from-right duration-300 ${
              alert.type === "leave"
                ? "bg-red-50 border-red-500 text-red-800"
                : "bg-green-50 border-green-500 text-green-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {alert.type === "leave" ? "⚠️" : "👋"}
              </span>
              <p className="font-medium">{alert.message}</p>
            </div>
            <button
              onClick={() => onAlertDismiss(alert.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <BgAnimated />
    </div>
  );
}
