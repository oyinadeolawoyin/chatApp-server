/*
  Warnings:

  - You are about to drop the column `contactId` on the `Chat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_contactId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "contactId";

-- CreateTable
CREATE TABLE "_ChatContacts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ChatContacts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ChatContacts_B_index" ON "_ChatContacts"("B");

-- AddForeignKey
ALTER TABLE "_ChatContacts" ADD CONSTRAINT "_ChatContacts_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatContacts" ADD CONSTRAINT "_ChatContacts_B_fkey" FOREIGN KEY ("B") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
