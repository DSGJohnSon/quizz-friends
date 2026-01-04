export type DisplayTarget = "AUTO" | "DISPLAY_1" | "DISPLAY_2";

export type DisplayViewType = "EMPTY" | "LOBBY" | "SCOREBOARD";

export interface BaseDisplayView {
  type: DisplayViewType;
}

export interface EmptyView extends BaseDisplayView {
  type: "EMPTY";
}

export interface LobbyView extends BaseDisplayView {
  type: "LOBBY";
}

export interface ScoreboardView extends BaseDisplayView {
  type: "SCOREBOARD";
}

export type DisplayView = EmptyView | LobbyView | ScoreboardView;

export interface DisplayInfo {
  view: DisplayView;
  lastHeartbeat?: number; // Timestamp ms
}

export interface DisplayState {
  display1: DisplayInfo;
  display2: DisplayInfo;
}

export interface DisplayAction {
  type: "SHOW_LOBBY" | "SHOW_SCOREBOARD";
  target?: DisplayTarget;
  payload?: any;
}
