export interface SlackApiImpl {
  sendMessage(message: unknown): Promise<unknown>;
}
