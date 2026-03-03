import { db } from "../storage/db-schema";
import { demoConversations, demoMessages } from "./demo-data";

export async function loadDemoData(): Promise<void> {
  await db.conversations.bulkPut(demoConversations);
  await db.messages.bulkPut(demoMessages);
}
