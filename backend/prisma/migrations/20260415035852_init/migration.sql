-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boards" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "background_color" TEXT NOT NULL DEFAULT '#0079bf',
    "background_image" TEXT,
    "is_starred" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board_members" (
    "id" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "board_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lists" (
    "id" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "list_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3),
    "cover_image" TEXT,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "labels" (
    "id" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    "name" TEXT,
    "color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_labels" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "label_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_members" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklists" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_items" (
    "id" TEXT NOT NULL,
    "checklist_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "uploaded_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "board_id" TEXT,
    "card_id" TEXT,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "board_members_board_id_user_id_key" ON "board_members"("board_id", "user_id");

-- CreateIndex
CREATE INDEX "lists_board_id_idx" ON "lists"("board_id");

-- CreateIndex
CREATE INDEX "lists_board_id_position_idx" ON "lists"("board_id", "position");

-- CreateIndex
CREATE INDEX "cards_list_id_idx" ON "cards"("list_id");

-- CreateIndex
CREATE INDEX "cards_list_id_position_idx" ON "cards"("list_id", "position");

-- CreateIndex
CREATE INDEX "cards_is_archived_idx" ON "cards"("is_archived");

-- CreateIndex
CREATE INDEX "labels_board_id_idx" ON "labels"("board_id");

-- CreateIndex
CREATE INDEX "card_labels_card_id_idx" ON "card_labels"("card_id");

-- CreateIndex
CREATE UNIQUE INDEX "card_labels_card_id_label_id_key" ON "card_labels"("card_id", "label_id");

-- CreateIndex
CREATE INDEX "card_members_card_id_idx" ON "card_members"("card_id");

-- CreateIndex
CREATE UNIQUE INDEX "card_members_card_id_user_id_key" ON "card_members"("card_id", "user_id");

-- CreateIndex
CREATE INDEX "checklists_card_id_idx" ON "checklists"("card_id");

-- CreateIndex
CREATE INDEX "checklist_items_checklist_id_idx" ON "checklist_items"("checklist_id");

-- CreateIndex
CREATE INDEX "comments_card_id_idx" ON "comments"("card_id");

-- CreateIndex
CREATE INDEX "attachments_card_id_idx" ON "attachments"("card_id");

-- CreateIndex
CREATE INDEX "activities_board_id_idx" ON "activities"("board_id");

-- CreateIndex
CREATE INDEX "activities_card_id_idx" ON "activities"("card_id");

-- CreateIndex
CREATE INDEX "activities_created_at_idx" ON "activities"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "boards" ADD CONSTRAINT "boards_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_members" ADD CONSTRAINT "board_members_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_members" ADD CONSTRAINT "board_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labels" ADD CONSTRAINT "labels_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_labels" ADD CONSTRAINT "card_labels_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_labels" ADD CONSTRAINT "card_labels_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_members" ADD CONSTRAINT "card_members_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_members" ADD CONSTRAINT "card_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklists" ADD CONSTRAINT "checklists_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_items" ADD CONSTRAINT "checklist_items_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "checklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
