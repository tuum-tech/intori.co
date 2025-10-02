-- CreateEnum
CREATE TYPE "FriendRequestStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "PointRecordActionType" AS ENUM ('earlyAccessBonus', 'answeredQuestion', 'openedGift', 'friendAccepted', 'unlockedGift', 'sentSuperGift', 'openedSuperGift', 'castShare');

-- CreateEnum
CREATE TYPE "TypeOfGift" AS ENUM ('NORMAL', 'NEW_CONNECTION', 'THANK_YOU', 'SHOUT_OUT', 'ENCOURAGEMENT', 'HAPPY_BIRTHDAY', 'PING');

-- CreateEnum
CREATE TYPE "LimitType" AS ENUM ('FRIEND_REQUESTS', 'GIFTS_SENT', 'SUGGESTIONS_SHOWN');

-- CreateEnum
CREATE TYPE "FriendRequestSource" AS ENUM ('MANUAL', 'MUTUAL_FOLLOWERS');

-- CreateEnum
CREATE TYPE "IntoriPlusApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "AnswerUnlockTopic" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "unlockTopics" TEXT[],

    CONSTRAINT "AnswerUnlockTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimTransactionRecord" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionHash" TEXT NOT NULL,
    "bigIntAmount" BIGINT NOT NULL,

    CONSTRAINT "ClaimTransactionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarlyAccessFid" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,

    CONSTRAINT "EarlyAccessFid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" TEXT NOT NULL,
    "fromFid" INTEGER NOT NULL,
    "toFid" INTEGER NOT NULL,
    "status" "FriendRequestStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "source" "FriendRequestSource" NOT NULL DEFAULT 'MANUAL',

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointRecord" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "pointsMultiplier" INTEGER NOT NULL,
    "action" "PointRecordActionType" NOT NULL,
    "relevantActionObjectId" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answers" TEXT[],
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "topics" TEXT[],

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionCategory" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "QuestionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialGiftTransaction" (
    "id" TEXT NOT NULL,
    "sentFromFid" INTEGER NOT NULL,
    "sentToFid" INTEGER NOT NULL,
    "giftType" "TypeOfGift" NOT NULL,
    "totalCostAmount" INTEGER NOT NULL,
    "intoriFee" INTEGER NOT NULL,
    "createdGiftTransactionHash" TEXT,
    "openedGiftTransactionHash" TEXT,
    "giftId" TEXT,
    "giftIdToSendBackFor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpecialGiftTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnswer" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "publicHash" TEXT,
    "publicBlockHash" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publicBlockNumber" INTEGER,
    "embeddingPending" BOOLEAN NOT NULL DEFAULT false,
    "topic" TEXT,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnswerTotal" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAnswerTotal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGift" (
    "id" TEXT NOT NULL,
    "sentFromFid" INTEGER NOT NULL,
    "sentToFid" INTEGER NOT NULL,
    "opened" BOOLEAN NOT NULL DEFAULT false,
    "sentBackGiftFor" TEXT,
    "sentGiftBack" BOOLEAN,
    "giftType" "TypeOfGift" NOT NULL DEFAULT 'NORMAL',
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInsightLike" (
    "id" TEXT NOT NULL,
    "likedByFid" INTEGER NOT NULL,
    "answerInsightId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInsightLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotificationDetails" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "UserNotificationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPointTotals" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "bigIntPoints" BIGINT NOT NULL,

    CONSTRAINT "UserPointTotals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "fid" INTEGER NOT NULL,
    "pfp_url" TEXT,
    "display_name" TEXT,
    "power_badge" BOOLEAN NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("fid")
);

-- CreateTable
CREATE TABLE "UserQuestionSkip" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserQuestionSkip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserUnlockedTopic" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserUnlockedTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletAuthentication" (
    "id" TEXT NOT NULL,
    "notBefore" TEXT NOT NULL,
    "expirationTime" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,

    CONSTRAINT "WalletAuthentication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpamScore" (
    "fid" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "whitelist" BOOLEAN NOT NULL DEFAULT false,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "preventClaiming" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SpamScore_pkey" PRIMARY KEY ("fid")
);

-- CreateTable
CREATE TABLE "UserProfileEmbedding" (
    "fid" INTEGER NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfileEmbedding_pkey" PRIMARY KEY ("fid")
);

-- CreateTable
CREATE TABLE "RedFlag" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RedFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayPass" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalCostAmount" INTEGER NOT NULL,
    "transactionHash" TEXT NOT NULL,

    CONSTRAINT "DayPass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendRequestSettings" (
    "fid" INTEGER NOT NULL,
    "allowNewMutualFollowerFriendships" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FriendRequestSettings_pkey" PRIMARY KEY ("fid")
);

-- CreateTable
CREATE TABLE "InsightBoostTransaction" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "totalCostAmount" INTEGER NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "answerId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsightBoostTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightBoostView" (
    "id" TEXT NOT NULL,
    "viewedByFid" INTEGER NOT NULL,
    "viewedInsightBoostTransactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsightBoostView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MutualFollowsJob" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MutualFollowsJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuggestedUser" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "suggestedFid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuggestedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyStats" (
    "id" TEXT NOT NULL,
    "uniqueUsers" INTEGER NOT NULL,
    "questionsAnswered" INTEGER NOT NULL,
    "pendingFriendRequests" INTEGER NOT NULL,
    "acceptedFriendRequests" INTEGER NOT NULL,
    "giftsSent" INTEGER NOT NULL,
    "specialGiftsSent" INTEGER NOT NULL,
    "dayPassesBought" INTEGER NOT NULL,
    "insightsBoosted" INTEGER NOT NULL,
    "insightLikes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeUsersAllowedIn" INTEGER NOT NULL DEFAULT 0,
    "bannedUsers" INTEGER NOT NULL DEFAULT 0,
    "usersBlocked" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyCheckInQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answers" TEXT[],
    "shownAt" TIMESTAMP(3),
    "category" TEXT NOT NULL,

    CONSTRAINT "DailyCheckInQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcludedSuggestion" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "excludedFid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExcludedSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightRating" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "answerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InsightRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedInsightClickRecord" (
    "id" TEXT NOT NULL,
    "casterFid" INTEGER NOT NULL,
    "questionId" TEXT NOT NULL,
    "clickedByFid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedInsightClickRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyCheckInResponse" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyCheckInResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyCheckInRewardTransaction" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "bigIntAmount" BIGINT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyCheckInRewardTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntoriPlusApplication" (
    "id" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "status" "IntoriPlusApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntoriPlusApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMiscPreferences" (
    "fid" INTEGER NOT NULL,
    "showGiftsHelper" BOOLEAN NOT NULL DEFAULT true,
    "showDailyCheckInHelper" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserMiscPreferences_pkey" PRIMARY KEY ("fid")
);

-- CreateTable
CREATE TABLE "Cluster" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "blurb" TEXT,
    "emoji" TEXT,
    "accentColor" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "autoJoin" BOOLEAN NOT NULL DEFAULT false,
    "unlockRules" JSONB NOT NULL,
    "joinLogic" JSONB NOT NULL,
    "activeHours" INTEGER,
    "homeFeed" JSONB,
    "moderation" JSONB,
    "analytics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCluster" (
    "userFid" INTEGER NOT NULL,
    "clusterId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeAt" TIMESTAMP(3),

    CONSTRAINT "UserCluster_pkey" PRIMARY KEY ("userFid","clusterId")
);

-- CreateTable
CREATE TABLE "UserSummary" (
    "userFid" INTEGER NOT NULL,
    "summaryText" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,

    CONSTRAINT "UserSummary_pkey" PRIMARY KEY ("userFid")
);

-- CreateTable
CREATE TABLE "FeedEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "actorId" TEXT,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FriendRequest_fromFid_toFid_lastUpdated_idx" ON "FriendRequest"("fromFid", "toFid", "lastUpdated");

-- CreateIndex
CREATE INDEX "Question_question_idx" ON "Question"("question");

-- CreateIndex
CREATE INDEX "UserAnswer_question_fid_idx" ON "UserAnswer"("question", "fid");

-- CreateIndex
CREATE INDEX "DayPass_fid_createdAt_idx" ON "DayPass"("fid", "createdAt");

-- CreateIndex
CREATE INDEX "InsightBoostTransaction_fid_answerId_updatedAt_idx" ON "InsightBoostTransaction"("fid", "answerId", "updatedAt");

-- CreateIndex
CREATE INDEX "InsightBoostView_viewedByFid_viewedInsightBoostTransactionI_idx" ON "InsightBoostView"("viewedByFid", "viewedInsightBoostTransactionId");

-- CreateIndex
CREATE INDEX "MutualFollowsJob_fid_idx" ON "MutualFollowsJob"("fid");

-- CreateIndex
CREATE INDEX "SuggestedUser_fid_suggestedFid_idx" ON "SuggestedUser"("fid", "suggestedFid");

-- CreateIndex
CREATE INDEX "DailyCheckInQuestion_question_idx" ON "DailyCheckInQuestion"("question");

-- CreateIndex
CREATE INDEX "DailyCheckInQuestion_shownAt_idx" ON "DailyCheckInQuestion"("shownAt");

-- CreateIndex
CREATE INDEX "ExcludedSuggestion_fid_excludedFid_idx" ON "ExcludedSuggestion"("fid", "excludedFid");

-- CreateIndex
CREATE INDEX "DailyCheckInRewardTransaction_fid_createdAt_idx" ON "DailyCheckInRewardTransaction"("fid", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Cluster_slug_key" ON "Cluster"("slug");

-- CreateIndex
CREATE INDEX "FeedEvent_createdAt_type_idx" ON "FeedEvent"("createdAt", "type");

-- AddForeignKey
ALTER TABLE "QuestionCategory" ADD CONSTRAINT "QuestionCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionCategory" ADD CONSTRAINT "QuestionCategory_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInsightLike" ADD CONSTRAINT "UserInsightLike_answerInsightId_fkey" FOREIGN KEY ("answerInsightId") REFERENCES "UserAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInsightLike" ADD CONSTRAINT "UserInsightLike_likedByFid_fkey" FOREIGN KEY ("likedByFid") REFERENCES "UserProfile"("fid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCluster" ADD CONSTRAINT "UserCluster_userFid_fkey" FOREIGN KEY ("userFid") REFERENCES "UserProfile"("fid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCluster" ADD CONSTRAINT "UserCluster_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSummary" ADD CONSTRAINT "UserSummary_userFid_fkey" FOREIGN KEY ("userFid") REFERENCES "UserProfile"("fid") ON DELETE RESTRICT ON UPDATE CASCADE;
