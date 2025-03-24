-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sportCode" TEXT NOT NULL,
    "sportName" TEXT NOT NULL,
    "sportNameEn" TEXT,
    "clubCode" TEXT NOT NULL,
    "clubName" TEXT NOT NULL,
    "clubNameEn" TEXT,
    "subCity" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "registrationYear" TEXT NOT NULL,
    "documentPath" JSONB NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Club_clubCode_key" ON "Club"("clubCode");
