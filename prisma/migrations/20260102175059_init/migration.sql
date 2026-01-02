-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'OPEN', 'LOCKED', 'IN_PROGRESS', 'FINISHED');

-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "expectedPlayerCount" INTEGER NOT NULL DEFAULT 4,
    "status" "SessionStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "isConnected" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameSession_code_key" ON "GameSession"("code");

-- CreateIndex
CREATE INDEX "GameSession_code_idx" ON "GameSession"("code");

-- CreateIndex
CREATE INDEX "GameSession_status_idx" ON "GameSession"("status");

-- CreateIndex
CREATE INDEX "Player_sessionId_idx" ON "Player"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_sessionId_name_key" ON "Player"("sessionId", "name");

-- CreateIndex
CREATE INDEX "Module_sessionId_idx" ON "Module"("sessionId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
