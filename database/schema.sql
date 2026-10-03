-- ============================================================
-- Research Collaboration Portal — Database Schema
-- Engine: MySQL 8.x InnoDB | Charset: utf8mb4_unicode_ci
-- ============================================================
-- Architecture note (viva):
--   InnoDB is required for FOREIGN KEY constraints and transactions.
--   utf8mb4 supports full Unicode including emoji in bio/messages.
--   We use DATETIME (not TIMESTAMP) for created_at/updated_at because
--   TIMESTAMP silently converts to UTC and has a 2038 limit.
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;   -- disable while dropping/creating tables

DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS ProgressReport;
DROP TABLE IF EXISTS Task;
DROP TABLE IF EXISTS Milestone;
DROP TABLE IF EXISTS Document;
DROP TABLE IF EXISTS ProjectMember;
DROP TABLE IF EXISTS CollaborationRequest;
DROP TABLE IF EXISTS ProjectSkill;
DROP TABLE IF EXISTS UserSkill;
DROP TABLE IF EXISTS ResearchProject;
DROP TABLE IF EXISTS Skill;
DROP TABLE IF EXISTS User;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. User
-- ============================================================
CREATE TABLE User (
    user_id       INT            NOT NULL AUTO_INCREMENT,
    name          VARCHAR(120)   NOT NULL,
    email         VARCHAR(191)   NOT NULL,
    password_hash VARCHAR(255)   NOT NULL,
    role          ENUM('STUDENT','FACULTY','EXTERNAL','ADMIN') NOT NULL,
    institution   VARCHAR(200)   DEFAULT NULL,
    bio           TEXT           DEFAULT NULL,
    profile_image VARCHAR(500)   DEFAULT NULL,  -- stores relative path in uploads/
    created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id),
    UNIQUE KEY uq_user_email (email),
    -- Index on role for admin queries filtering by role
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 2. Skill
-- ============================================================
CREATE TABLE Skill (
    skill_id   INT          NOT NULL AUTO_INCREMENT,
    skill_name VARCHAR(100) NOT NULL,

    PRIMARY KEY (skill_id),
    UNIQUE KEY uq_skill_name (skill_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 3. UserSkill  (many-to-many: User ↔ Skill)
-- Design decision: is_interest flag added here instead of a
-- new entity. A skill can be both a competency AND a research
-- interest for the same user — one row, one boolean toggle.
-- This avoids a 14th entity while keeping the ER clean.
-- ============================================================
CREATE TABLE UserSkill (
    user_id     INT     NOT NULL,
    skill_id    INT     NOT NULL,
    is_interest BOOLEAN NOT NULL DEFAULT FALSE,  -- TRUE = research interest

    PRIMARY KEY (user_id, skill_id),
    CONSTRAINT fk_userskill_user  FOREIGN KEY (user_id)  REFERENCES User(user_id)  ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_userskill_skill FOREIGN KEY (skill_id) REFERENCES Skill(skill_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 4. ResearchProject
-- ============================================================
CREATE TABLE ResearchProject (
    project_id      INT          NOT NULL AUTO_INCREMENT,
    title           VARCHAR(200) NOT NULL,
    description     TEXT         DEFAULT NULL,
    research_domain VARCHAR(150) NOT NULL,
    status          ENUM('Planning','Active','On Hold','Completed','Archived') NOT NULL DEFAULT 'Planning',
    leader_id       INT          NOT NULL,   -- must be FACULTY user
    deadline        DATE         DEFAULT NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (project_id),
    -- RESTRICT: cannot delete a faculty user who leads a project
    CONSTRAINT fk_project_leader FOREIGN KEY (leader_id) REFERENCES User(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    -- Indexes for the search/filter API endpoints
    INDEX idx_project_status    (status),
    INDEX idx_project_domain    (research_domain),
    INDEX idx_project_leader    (leader_id),
    FULLTEXT INDEX ft_project_title (title)   -- enables MATCH...AGAINST for title search
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 5. ProjectSkill  (many-to-many: ResearchProject ↔ Skill)
-- ============================================================
CREATE TABLE ProjectSkill (
    project_id INT NOT NULL,
    skill_id   INT NOT NULL,

    PRIMARY KEY (project_id, skill_id),
    CONSTRAINT fk_projskill_project FOREIGN KEY (project_id) REFERENCES ResearchProject(project_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_projskill_skill   FOREIGN KEY (skill_id)   REFERENCES Skill(skill_id)             ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 6. CollaborationRequest
-- Unique constraint prevents duplicate Pending requests:
--   (project_id, applicant_id) can have only one Pending row.
--   Accepted/Rejected are allowed historically (past requests).
-- ============================================================
CREATE TABLE CollaborationRequest (
    request_id   INT      NOT NULL AUTO_INCREMENT,
    project_id   INT      NOT NULL,
    applicant_id INT      NOT NULL,
    message      TEXT     DEFAULT NULL,
    status       ENUM('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending',
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at  DATETIME DEFAULT NULL,

    PRIMARY KEY (request_id),
    CONSTRAINT fk_req_project   FOREIGN KEY (project_id)   REFERENCES ResearchProject(project_id) ON DELETE CASCADE  ON UPDATE CASCADE,
    CONSTRAINT fk_req_applicant FOREIGN KEY (applicant_id) REFERENCES User(user_id)               ON DELETE CASCADE  ON UPDATE CASCADE,
    -- Prevent duplicate PENDING requests from same user to same project
    -- Allows multiple rows as long as only one is Pending at a time
    UNIQUE KEY uq_pending_request (project_id, applicant_id, status),
    INDEX idx_req_project   (project_id),
    INDEX idx_req_applicant (applicant_id),
    INDEX idx_req_status    (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 7. ProjectMember
-- ============================================================
CREATE TABLE ProjectMember (
    project_id INT          NOT NULL,
    user_id    INT          NOT NULL,
    role       VARCHAR(80)  NOT NULL DEFAULT 'Member',  -- e.g. 'Leader', 'Member', 'Co-Investigator'
    joined_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (project_id, user_id),
    CONSTRAINT fk_member_project FOREIGN KEY (project_id) REFERENCES ResearchProject(project_id) ON DELETE CASCADE  ON UPDATE CASCADE,
    CONSTRAINT fk_member_user    FOREIGN KEY (user_id)    REFERENCES User(user_id)               ON DELETE CASCADE  ON UPDATE CASCADE,
    INDEX idx_member_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 8. Document
-- file_path stores the path inside backend/uploads/ (private).
-- Never expose file_path directly; serve via authenticated endpoint.
-- ============================================================
CREATE TABLE Document (
    document_id INT          NOT NULL AUTO_INCREMENT,
    project_id  INT          NOT NULL,
    uploaded_by INT          DEFAULT NULL,   -- NULL if uploader account deleted
    file_name   VARCHAR(255) NOT NULL,
    file_path   VARCHAR(500) NOT NULL,       -- relative path in uploads/
    version     INT          NOT NULL DEFAULT 1,
    uploaded_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (document_id),
    CONSTRAINT fk_doc_project  FOREIGN KEY (project_id)  REFERENCES ResearchProject(project_id) ON DELETE CASCADE  ON UPDATE CASCADE,
    CONSTRAINT fk_doc_uploader FOREIGN KEY (uploaded_by) REFERENCES User(user_id)               ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_doc_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 9. Milestone
-- ============================================================
CREATE TABLE Milestone (
    milestone_id INT          NOT NULL AUTO_INCREMENT,
    project_id   INT          NOT NULL,
    title        VARCHAR(200) NOT NULL,
    description  TEXT         DEFAULT NULL,
    due_date     DATE         DEFAULT NULL,
    status       ENUM('Pending','In Progress','Completed') NOT NULL DEFAULT 'Pending',

    PRIMARY KEY (milestone_id),
    CONSTRAINT fk_milestone_project FOREIGN KEY (project_id) REFERENCES ResearchProject(project_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_milestone_project (project_id),
    INDEX idx_milestone_status  (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 10. Task
-- assigned_to SET NULL if the user is deleted — task remains,
-- just unassigned, so the project history is preserved.
-- ============================================================
CREATE TABLE Task (
    task_id     INT          NOT NULL AUTO_INCREMENT,
    milestone_id INT         NOT NULL,
    assigned_to  INT         DEFAULT NULL,
    title        VARCHAR(200) NOT NULL,
    description  TEXT        DEFAULT NULL,
    due_date     DATE        DEFAULT NULL,
    status       ENUM('To Do','In Progress','Completed') NOT NULL DEFAULT 'To Do',

    PRIMARY KEY (task_id),
    CONSTRAINT fk_task_milestone FOREIGN KEY (milestone_id) REFERENCES Milestone(milestone_id) ON DELETE CASCADE  ON UPDATE CASCADE,
    CONSTRAINT fk_task_assignee  FOREIGN KEY (assigned_to)  REFERENCES User(user_id)           ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_task_milestone   (milestone_id),
    INDEX idx_task_assigned_to (assigned_to),
    INDEX idx_task_status      (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 11. ProgressReport
-- submitted_by SET NULL if the author's account is deleted.
-- ============================================================
CREATE TABLE ProgressReport (
    report_id    INT      NOT NULL AUTO_INCREMENT,
    project_id   INT      NOT NULL,
    submitted_by INT      DEFAULT NULL,
    content      TEXT     NOT NULL,
    submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (report_id),
    CONSTRAINT fk_report_project   FOREIGN KEY (project_id)   REFERENCES ResearchProject(project_id) ON DELETE CASCADE  ON UPDATE CASCADE,
    CONSTRAINT fk_report_submitter FOREIGN KEY (submitted_by) REFERENCES User(user_id)               ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_report_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 12. Message
-- Project-scoped team chat. Polling-based (no WebSocket).
-- sender_id SET NULL if sender's account is deleted — message
-- text is preserved so conversation history stays intact.
-- ============================================================
CREATE TABLE Message (
    message_id INT      NOT NULL AUTO_INCREMENT,
    project_id INT      NOT NULL,
    sender_id  INT      DEFAULT NULL,
    message    TEXT     NOT NULL,
    sent_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (message_id),
    CONSTRAINT fk_msg_project FOREIGN KEY (project_id) REFERENCES ResearchProject(project_id) ON DELETE CASCADE  ON UPDATE CASCADE,
    CONSTRAINT fk_msg_sender  FOREIGN KEY (sender_id)  REFERENCES User(user_id)               ON DELETE SET NULL ON UPDATE CASCADE,
    -- Compound index for the polling query: "give me messages for project X after timestamp T"
    INDEX idx_msg_project_time (project_id, sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 13. Notification
-- Per-user, per-event. is_read flag drives the unread badge count.
-- ============================================================
CREATE TABLE Notification (
    notification_id INT          NOT NULL AUTO_INCREMENT,
    user_id         INT          NOT NULL,
    type            VARCHAR(60)  NOT NULL,   -- e.g. 'REQUEST_RECEIVED', 'REQUEST_ACCEPTED'
    message         VARCHAR(500) NOT NULL,
    is_read         BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (notification_id),
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    -- Compound index: fast lookup of unread notifications per user
    INDEX idx_notif_user_read (user_id, is_read),
    INDEX idx_notif_created   (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
