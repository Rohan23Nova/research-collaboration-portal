-- ============================================================
-- Research Collaboration Portal — Seed Data
-- ALL passwords are bcrypt(12) of "Password@123"
-- These are OBVIOUSLY FAKE credentials for development only.
-- ============================================================

-- Disable FK checks during bulk insert for speed
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- USERS (8 users: 1 admin, 2 faculty, 4 students, 1 external)
-- ============================================================
INSERT INTO User (user_id, name, email, password_hash, role, institution, bio) VALUES

-- Admin
(1, 'Portal Admin',
 'admin@rcportal.edu',
 '$2a$12$PHgO8j1iRtlXMYBQ37ii2e98QF7rBpYhV7hRu0F.0m1LRJ0bdfzIW',
 'ADMIN',
 'Research Collaboration Portal',
 'System administrator responsible for platform management.'),

-- Faculty 1 — leads Projects 1, 2, 4
(2, 'Dr. Priya Sharma',
 'dr.sharma@iit.edu',
 '$2a$12$Fonm/fHHMXt/P.drlDFDI.MqtdXV1NjxlV1yD91/IOWRG0..aVvxe',
 'FACULTY',
 'IIT Delhi',
 'Associate Professor specializing in Machine Learning and AI for healthcare applications. 12 years of research experience.'),

-- Faculty 2 — leads Projects 3, 5, 6
(3, 'Prof. Rahul Mehta',
 'prof.mehta@nit.edu',
 '$2a$12$kEo3DPzHwrL2J9ia2ISjWeenQa4lMVN4.FPTbQk7hMYsm7XavuvGq',
 'FACULTY',
 'NIT Trichy',
 'Professor of Computer Science. Research interests: NLP, distributed systems, federated learning.'),

-- Student 1 — member of Project 1 (accepted), pending on Project 2
(4, 'Alice Chen',
 'alice.chen@student.edu',
 '$2a$12$SBG96osgIqPA1V9l2Tri7us3VmkBClPAhzXIG/o8.K.LayPV.riIe',
 'STUDENT',
 'IIT Delhi',
 'Final year B.Tech student, passionate about deep learning and medical AI.'),

-- Student 2 — member of Project 3, rejected from Project 4
(5, 'Bob Kumar',
 'bob.kumar@student.edu',
 '$2a$12$qDBfM7cJhltz50uKhzq8GOEhvooxNKPok.E6vsfzhE7gU3fg61UCq',
 'STUDENT',
 'NIT Trichy',
 'M.Tech student focusing on NLP and sentiment analysis research.'),

-- Student 3 — member of Project 5, pending on Project 6
(6, 'Carol Patel',
 'carol.patel@student.edu',
 '$2a$12$36Kf8a/nTFeo3CWQqnyJR.MziHZbubzRyGnAvy4sEdjEwiltwnTim',
 'STUDENT',
 'IIT Bombay',
 'B.Tech student interested in IoT, embedded systems, and smart home automation.'),

-- Student 4 — member of Project 5, pending on Project 1
(7, 'David Singh',
 'david.singh@student.edu',
 '$2a$12$RIxrULs9/LOvBrYDzDNdieYVt9tvhYH0BP3h.82QJTFT4U7gjm.vq',
 'STUDENT',
 'BITS Pilani',
 'Final year student with strong background in computer vision and image processing.'),

-- External researcher — member of Project 6, rejected from Project 1
(8, 'Dr. Lisa Park',
 'lisa.park@techcorp.com',
 '$2a$12$wMagvlMWUlqotzAI9upDJu5O/.fE/Q/MY2iopBx87QasIWIWAtfuy',
 'EXTERNAL',
 'TechCorp Research Labs',
 'Industry researcher with expertise in federated learning and privacy-preserving AI. Collaborating with academia.');


-- ============================================================
-- SKILLS (20 skills)
-- ============================================================
INSERT INTO Skill (skill_id, skill_name) VALUES
(1,  'Machine Learning'),
(2,  'Deep Learning'),
(3,  'Python'),
(4,  'Java'),
(5,  'React'),
(6,  'Node.js'),
(7,  'MySQL'),
(8,  'TensorFlow'),
(9,  'Natural Language Processing'),
(10, 'Computer Vision'),
(11, 'Data Analysis'),
(12, 'Research Writing'),
(13, 'IoT'),
(14, 'Embedded Systems'),
(15, 'Cloud Computing'),
(16, 'Docker'),
(17, 'Cybersecurity'),
(18, 'Blockchain'),
(19, 'Bioinformatics'),
(20, 'Federated Learning');


-- ============================================================
-- USER SKILLS + INTERESTS
-- is_interest=1 → tagged as a research interest
-- ============================================================
INSERT INTO UserSkill (user_id, skill_id, is_interest) VALUES
-- Admin: basic tech skills
(1, 3,  0), (1, 7,  0), (1, 15, 0),

-- Dr. Sharma (Faculty 1): ML/AI focus
(2, 1,  1), (2, 2,  1), (2, 3,  1), (2, 8,  1),
(2, 10, 0), (2, 12, 1), (2, 11, 0),

-- Prof. Mehta (Faculty 2): NLP/FL focus
(3, 1,  1), (3, 9,  1), (3, 3,  1), (3, 20, 1),
(3, 15, 0), (3, 12, 1), (3, 11, 0),

-- Alice (Student 1): deep learning / medical AI
(4, 2,  1), (4, 1,  1), (4, 3,  1), (4, 8,  0),
(4, 10, 0), (4, 12, 0),

-- Bob (Student 2): NLP focus
(5, 9,  1), (5, 3,  1), (5, 1,  0), (5, 11, 0),
(5, 12, 0),

-- Carol (Student 3): IoT / embedded
(6, 13, 1), (6, 14, 1), (6, 3,  0), (6, 15, 0),

-- David (Student 4): computer vision
(7, 10, 1), (7, 2,  1), (7, 3,  1), (7, 8,  0),
(7, 11, 0),

-- Dr. Lisa Park (External): federated learning
(8, 20, 1), (8, 1,  1), (8, 2,  0), (8, 15, 0),
(8, 12, 1);


-- ============================================================
-- RESEARCH PROJECTS (6 projects)
-- ============================================================
INSERT INTO ResearchProject
  (project_id, title, description, research_domain, status, leader_id, deadline) VALUES

(1, 'AI-Powered Medical Diagnosis System',
 'Developing a deep learning model to assist radiologists in detecting anomalies in X-ray and MRI scans. The system uses convolutional neural networks trained on a dataset of 50,000+ annotated images.',
 'Artificial Intelligence', 'Active', 2, '2027-03-31'),

(2, 'Smart IoT Home Automation Platform',
 'Building a low-cost, open-source home automation system using Raspberry Pi and MQTT protocol. Focuses on energy efficiency, security, and seamless device interoperability.',
 'Internet of Things', 'Planning', 2, '2027-06-30'),

(3, 'NLP-Based Sentiment Analysis for Social Media',
 'Designing a real-time sentiment analysis pipeline for multilingual social media content using transformer-based models (BERT, XLM-R). Target languages: English, Hindi, Tamil.',
 'Natural Language Processing', 'Active', 3, '2026-12-15'),

(4, 'Blockchain for Academic Credential Verification',
 'Creating a decentralized system on Ethereum to issue, store, and verify academic certificates. Eliminates credential fraud by making records tamper-proof and publicly auditable.',
 'Blockchain Technology', 'On Hold', 2, '2027-09-01'),

(5, 'Computer Vision for Smart Traffic Management',
 'Using YOLO-based object detection to analyze real-time traffic camera feeds, automatically adjust signal timings, detect violations, and generate traffic density reports.',
 'Computer Vision', 'Completed', 3, '2026-06-30'),

(6, 'Federated Learning for Privacy-Preserving ML',
 'Researching federated learning architectures that allow hospitals and clinics to jointly train ML models without sharing raw patient data. Uses differential privacy and secure aggregation.',
 'Federated Learning', 'Active', 3, '2027-12-31');


-- ============================================================
-- PROJECT SKILLS (required skills per project)
-- ============================================================
INSERT INTO ProjectSkill (project_id, skill_id) VALUES
-- Project 1: AI Medical
(1, 1), (1, 2), (1, 3), (1, 8), (1, 10), (1, 12),
-- Project 2: IoT
(2, 13), (2, 14), (2, 3), (2, 15),
-- Project 3: NLP
(3, 9), (3, 3), (3, 1), (3, 11), (3, 12),
-- Project 4: Blockchain
(4, 18), (4, 3), (4, 17), (4, 12),
-- Project 5: Computer Vision (Completed)
(5, 10), (5, 2), (5, 3), (5, 8),
-- Project 6: Federated Learning
(6, 20), (6, 1), (6, 2), (6, 3), (6, 15);


-- ============================================================
-- COLLABORATION REQUESTS
-- Cover all 3 statuses: Pending, Accepted, Rejected
-- ============================================================
INSERT INTO CollaborationRequest
  (request_id, project_id, applicant_id, message, status, created_at, reviewed_at) VALUES

-- Accepted requests (these led to ProjectMember rows below)
(1, 1, 4,
 'I am a final year B.Tech student with hands-on experience in TensorFlow and CNNs. I have implemented a skin lesion classifier as my mini-project. I would love to contribute to the medical AI domain.',
 'Accepted', '2026-08-10 09:15:00', '2026-08-12 14:30:00'),

(2, 3, 5,
 'I have been working with BERT-based models for my thesis on code-switching in social media. This project aligns perfectly with my research. Excited to contribute to multilingual NLP!',
 'Accepted', '2026-08-15 11:00:00', '2026-08-17 10:00:00'),

(3, 5, 7,
 'Computer vision is my primary research area. I have implemented YOLO v8 for pedestrian detection. The traffic management application is a great real-world use case.',
 'Accepted', '2026-04-20 08:45:00', '2026-04-22 16:00:00'),

(4, 6, 8,
 'I am an industry researcher with 3 published papers on federated learning and differential privacy. Collaboration between academia and industry on this topic would be mutually beneficial.',
 'Accepted', '2026-09-01 10:00:00', '2026-09-03 09:00:00'),

-- Rejected requests
(5, 1, 8,
 'Interested in contributing to the medical AI project from an industry perspective, particularly around model deployment and MLOps.',
 'Rejected', '2026-08-05 14:00:00', '2026-08-08 11:00:00'),

(6, 4, 5,
 'I have some exposure to Ethereum smart contracts and would like to explore blockchain-based systems.',
 'Rejected', '2026-09-10 09:30:00', '2026-09-12 15:00:00'),

-- Pending requests (not yet reviewed)
(7, 2, 6,
 'I have built two home automation prototypes using Arduino and Raspberry Pi. IoT is my primary interest. Would love to join this project!',
 'Pending', '2026-10-01 10:30:00', NULL),

(8, 1, 7,
 'Computer vision is directly relevant to medical imaging. I can contribute to the image preprocessing and model evaluation pipeline.',
 'Pending', '2026-10-02 16:00:00', NULL),

(9, 6, 4,
 'I am very interested in the privacy aspects of federated learning. My deep learning background would complement the team.',
 'Pending', '2026-10-03 08:00:00', NULL);


-- ============================================================
-- PROJECT MEMBERS
-- Leaders are also inserted as members (role = 'Leader')
-- ============================================================
INSERT INTO ProjectMember (project_id, user_id, role, joined_at) VALUES
-- Project 1: AI Medical
(1, 2, 'Leader', '2026-07-01 09:00:00'),
(1, 4, 'Member', '2026-08-13 09:00:00'),   -- Alice (accepted req #1)

-- Project 2: IoT (only leader so far, others pending)
(2, 2, 'Leader', '2026-09-01 09:00:00'),

-- Project 3: NLP
(3, 3, 'Leader', '2026-07-15 09:00:00'),
(3, 5, 'Member', '2026-08-18 09:00:00'),   -- Bob (accepted req #2)

-- Project 4: Blockchain (on hold — only leader)
(4, 2, 'Leader', '2026-06-01 09:00:00'),

-- Project 5: Traffic (completed)
(5, 3, 'Leader', '2026-01-10 09:00:00'),
(5, 7, 'Member', '2026-04-23 09:00:00'),   -- David (accepted req #3)
(5, 6, 'Member', '2026-02-01 09:00:00'),   -- Carol joined early

-- Project 6: Federated Learning
(6, 3, 'Leader', '2026-09-01 09:00:00'),
(6, 8, 'Member', '2026-09-04 09:00:00');   -- Dr. Lisa Park (accepted req #4)


-- ============================================================
-- MILESTONES
-- ============================================================
INSERT INTO Milestone (milestone_id, project_id, title, description, due_date, status) VALUES

-- Project 1: AI Medical (Active)
(1, 1, 'Dataset Collection & Preprocessing',
 'Collect and annotate chest X-ray dataset. Apply augmentation techniques. Split into train/val/test sets.',
 '2026-09-30', 'Completed'),
(2, 1, 'Model Architecture Design & Training',
 'Design CNN architecture (ResNet-50 backbone). Train on preprocessed dataset. Achieve ≥90% AUC.',
 '2026-12-31', 'In Progress'),
(3, 1, 'Clinical Validation & Report',
 'Validate model with clinical experts. Write research paper draft. Prepare for submission.',
 '2027-03-31', 'Pending'),

-- Project 2: IoT (Planning)
(4, 2, 'Hardware Procurement & Setup',
 'Procure Raspberry Pi units, sensors, and networking equipment. Set up development environment.',
 '2026-11-30', 'Pending'),
(5, 2, 'MQTT Broker & Device Communication Layer',
 'Set up Mosquitto MQTT broker. Implement device discovery and pub/sub messaging.',
 '2027-01-31', 'Pending'),

-- Project 3: NLP (Active)
(6, 3, 'Data Collection & Annotation',
 'Scrape Twitter/Reddit for multilingual posts. Manual annotation of 10k samples per language.',
 '2026-09-15', 'Completed'),
(7, 3, 'Model Fine-tuning (BERT / XLM-R)',
 'Fine-tune XLM-RoBERTa on annotated multilingual dataset. Evaluate F1 per language.',
 '2026-11-30', 'In Progress'),
(8, 3, 'Real-time Pipeline & Dashboard',
 'Build Kafka-based streaming pipeline. Create visualization dashboard for live sentiment tracking.',
 '2026-12-15', 'Pending'),

-- Project 5: Traffic Vision (Completed)
(9, 5, 'Camera Integration & Data Pipeline',
 'Integrate IP cameras. Build OpenCV pipeline to capture and preprocess frames.',
 '2026-03-31', 'Completed'),
(10, 5, 'YOLO Training & Evaluation',
 'Train YOLOv8 on custom traffic dataset. Achieve mAP ≥ 0.85.',
 '2026-05-31', 'Completed'),
(11, 5, 'Deployment & Final Report',
 'Deploy on edge device. Present results to municipal traffic authority. Write final report.',
 '2026-06-30', 'Completed'),

-- Project 6: Federated Learning (Active)
(12, 6, 'Literature Review & Architecture Selection',
 'Review FedAvg, FedProx, SCAFFOLD algorithms. Select base architecture for experiments.',
 '2026-11-30', 'In Progress'),
(13, 6, 'Prototype Implementation',
 'Implement federated training with 3 simulated clients. Add differential privacy via PySyft.',
 '2027-03-31', 'Pending'),
(14, 6, 'Experiments & Paper Writing',
 'Run ablation studies. Compare accuracy vs. privacy budget tradeoff. Write conference paper.',
 '2027-12-31', 'Pending');


-- ============================================================
-- TASKS
-- ============================================================
INSERT INTO Task (task_id, milestone_id, assigned_to, title, description, due_date, status) VALUES

-- Milestone 1 (Project 1 — Dataset) — COMPLETED
(1,  1, 4, 'Download NIH ChestX-ray14 dataset',
 'Download from NIH Clinical Center. Verify checksums. Store on lab server.',
 '2026-09-10', 'Completed'),
(2,  1, 4, 'Write preprocessing pipeline',
 'Normalize pixel values, resize to 224x224, apply CLAHE for contrast enhancement.',
 '2026-09-25', 'Completed'),
(3,  1, 2, 'Validate annotations with radiologist',
 'Review 500 random samples with Dr. Kapoor. Resolve labeling disagreements.',
 '2026-09-28', 'Completed'),

-- Milestone 2 (Project 1 — Model) — IN PROGRESS
(4,  2, 4, 'Implement ResNet-50 baseline',
 'PyTorch implementation with transfer learning from ImageNet weights.',
 '2026-11-15', 'In Progress'),
(5,  2, 4, 'Hyperparameter tuning with Optuna',
 'Run 50 trials optimizing learning rate, batch size, dropout.',
 '2026-12-10', 'To Do'),
(6,  2, 2, 'Write model training report',
 'Document architecture choices, training curves, and AUC results.',
 '2026-12-30', 'To Do'),

-- Milestone 7 (Project 3 — Model Fine-tuning) — IN PROGRESS
(7,  7, 5, 'Set up HuggingFace training environment',
 'Configure GPU instance on cloud. Install transformers, datasets library.',
 '2026-10-15', 'Completed'),
(8,  7, 5, 'Fine-tune XLM-RoBERTa on Hindi data',
 'Use annotated Hindi tweets dataset. Target F1 ≥ 0.82.',
 '2026-11-10', 'In Progress'),
(9,  7, 3, 'Evaluate cross-lingual transfer',
 'Test zero-shot transfer from English model to Tamil. Document performance gap.',
 '2026-11-30', 'To Do'),

-- Milestone 9 (Project 5 — Camera Pipeline) — COMPLETED
(10, 9, 7, 'Configure IP camera feeds',
 'Set up RTSP streams from 4 intersection cameras. Test latency.',
 '2026-03-15', 'Completed'),
(11, 9, 6, 'Build frame sampling module',
 'Sample 2 FPS from each stream. Handle dropped frames gracefully.',
 '2026-03-28', 'Completed'),

-- Milestone 10 (Project 5 — YOLO Training) — COMPLETED
(12, 10, 7, 'Annotate custom traffic dataset',
 'Label 3000 frames with CVAT. Classes: car, truck, motorcycle, bus, pedestrian.',
 '2026-04-30', 'Completed'),
(13, 10, 7, 'Train YOLOv8 and evaluate',
 'Train for 100 epochs. Compute mAP@0.5 and mAP@0.5:0.95.',
 '2026-05-25', 'Completed'),

-- Milestone 12 (Project 6 — Literature Review) — IN PROGRESS
(14, 12, 8, 'Survey FedAvg and FedProx papers',
 'Read and summarise 15 key federated learning papers. Create comparison table.',
 '2026-10-31', 'In Progress'),
(15, 12, 3, 'Define experimental setup document',
 'Document dataset split strategy, client heterogeneity assumptions, and evaluation metrics.',
 '2026-11-15', 'To Do');


-- ============================================================
-- DOCUMENTS (metadata only — no actual files in seed)
-- ============================================================
INSERT INTO Document (document_id, project_id, uploaded_by, file_name, file_path, version) VALUES
(1, 1, 2, 'Project_Proposal_AI_Medical.pdf',   'uploads/proj1/Project_Proposal_AI_Medical.pdf',   1),
(2, 1, 4, 'Dataset_Preprocessing_Report.pdf',  'uploads/proj1/Dataset_Preprocessing_Report.pdf',  1),
(3, 1, 4, 'ResNet50_Training_Results_v1.xlsx',  'uploads/proj1/ResNet50_Training_Results_v1.xlsx', 1),
(4, 3, 3, 'NLP_Project_SRS.pdf',               'uploads/proj3/NLP_Project_SRS.pdf',               1),
(5, 3, 5, 'Annotation_Guidelines_v2.pdf',       'uploads/proj3/Annotation_Guidelines_v2.pdf',      2),
(6, 5, 3, 'Traffic_Vision_Final_Report.pdf',    'uploads/proj5/Traffic_Vision_Final_Report.pdf',   1),
(7, 5, 7, 'YOLO_Training_Metrics.csv',          'uploads/proj5/YOLO_Training_Metrics.csv',         1),
(8, 6, 8, 'FedLearning_Lit_Review_Draft.pdf',  'uploads/proj6/FedLearning_Lit_Review_Draft.pdf',  1);


-- ============================================================
-- PROGRESS REPORTS
-- ============================================================
INSERT INTO ProgressReport (report_id, project_id, submitted_by, content, submitted_at) VALUES

(1, 1, 4,
 'Week 8 Progress: Completed dataset download and preprocessing pipeline. Dataset contains 112,120 X-ray images across 14 pathology classes. Train/val/test split: 80/10/10. CLAHE preprocessing improved contrast significantly. Starting model implementation next week.',
 '2026-09-29 17:00:00'),

(2, 1, 4,
 'Week 12 Progress: ResNet-50 baseline trained for 30 epochs. Current AUC: 0.87. Identified class imbalance issue (pneumonia underrepresented). Implementing weighted sampling and focal loss. Hyperparameter search scheduled for next sprint.',
 '2026-10-03 18:30:00'),

(3, 3, 5,
 'Month 2 Progress: Completed annotation of 10,000 Hindi tweets and 8,500 English tweets. Inter-annotator agreement (Cohen kappa) = 0.78. XLM-RoBERTa fine-tuning started on Hindi data. Initial F1: 0.74. Target: 0.82.',
 '2026-10-01 16:00:00'),

(4, 6, 8,
 'Initial Report: Completed literature review of 12 papers on FedAvg, FedProx, and SCAFFOLD. Key finding: FedProx with proximal term μ=0.01 performs best under non-IID data. Proposing to use MNIST and CIFAR-10 as baselines. Architecture doc in progress.',
 '2026-10-02 14:00:00');


-- ============================================================
-- MESSAGES (project-scoped team chat)
-- ============================================================
INSERT INTO Message (message_id, project_id, sender_id, message, sent_at) VALUES

-- Project 1: AI Medical
(1,  1, 2, 'Welcome to the AI Medical Diagnosis project! Let''s aim to have the dataset preprocessing done by end of September.', '2026-08-13 10:00:00'),
(2,  1, 4, 'Thanks, Dr. Sharma! I have already downloaded the NIH ChestX-ray14 dataset and will start the preprocessing pipeline this week.', '2026-08-13 10:45:00'),
(3,  1, 2, 'Great! Make sure to apply CLAHE for histogram equalization — it significantly improves CNN performance on X-rays.', '2026-08-13 11:00:00'),
(4,  1, 4, 'Preprocessing pipeline is done. All 112K images resized to 224×224 and normalized. Ready for model training. Report uploaded.', '2026-09-29 17:30:00'),
(5,  1, 2, 'Excellent work, Alice! I reviewed the preprocessing report — it looks solid. Let''s discuss the ResNet-50 architecture on Friday''s call.', '2026-09-30 09:00:00'),

-- Project 3: NLP
(6,  3, 3, 'Team, annotation phase is complete. Great work everyone! Moving to fine-tuning phase now. Bob, please set up the cloud training instance.', '2026-09-16 09:00:00'),
(7,  3, 5, 'Instance is set up — using A100 GPU on Lambda Cloud. HuggingFace environment configured. Starting Hindi fine-tuning today.', '2026-09-16 11:00:00'),
(8,  3, 3, 'Perfect. Remember to log all experiments to Weights & Biases so we have full reproducibility.', '2026-09-16 11:30:00'),
(9,  3, 5, 'First training run done. Hindi F1 = 0.74. Class confusion between neutral and mixed-sentiment tweets. Trying different tokenization strategies.', '2026-10-01 18:00:00'),
(10, 3, 3, 'That confusion is expected. Try adding emoji features and maybe a custom tokenizer for Hindi hashtags.', '2026-10-01 18:45:00'),

-- Project 5: Traffic Vision (Completed)
(11, 5, 3, 'Final deployment successful! The system is now live at 4 intersections in Chennai. mAP@0.5 = 0.87 in production. Great work team!', '2026-06-28 16:00:00'),
(12, 5, 7, 'Amazing! The municipal authority was very impressed with the violation detection module. They want to expand to 10 more intersections next year.', '2026-06-28 16:30:00'),
(13, 5, 6, 'Huge congratulations everyone! This was a fantastic project. Final report has been submitted to the conference.', '2026-06-28 17:00:00'),

-- Project 6: Federated Learning
(14, 6, 3, 'Welcome to the FedLearn project, Lisa! Really glad to have your industry experience on board. Let''s start with the literature review this month.', '2026-09-04 10:00:00'),
(15, 6, 8, 'Thank you, Prof. Mehta! I have been working with FedProx and SCAFFOLD in production. Happy to share real-world observations from our hospital deployments.', '2026-09-04 10:30:00'),
(16, 6, 3, 'That''s invaluable. Please document those observations as part of the literature review. It will strengthen our experimental motivation.', '2026-09-04 11:00:00'),
(17, 6, 8, 'Draft lit review uploaded — covers 12 papers. Key finding: FedProx outperforms FedAvg under non-IID splits with μ=0.01. Shall we use CIFAR-10 as our baseline?', '2026-10-02 14:30:00'),
(18, 6, 3, 'Good choice. Let''s add FEMNIST as well for a realistic federated setting. I''ll define the experimental setup doc by next week.', '2026-10-02 15:00:00');


-- ============================================================
-- NOTIFICATIONS
-- ============================================================
INSERT INTO Notification (notification_id, user_id, type, message, is_read, created_at) VALUES

-- To Dr. Sharma (Faculty 1) — incoming requests
(1,  2, 'REQUEST_RECEIVED',
 'Alice Chen has requested to join "AI-Powered Medical Diagnosis System".',
 TRUE,  '2026-08-10 09:15:00'),
(2,  2, 'REQUEST_RECEIVED',
 'Dr. Lisa Park has requested to join "AI-Powered Medical Diagnosis System".',
 TRUE,  '2026-08-05 14:00:00'),
(3,  2, 'REQUEST_RECEIVED',
 'David Singh has requested to join "AI-Powered Medical Diagnosis System".',
 FALSE, '2026-10-02 16:00:00'),
(4,  2, 'REQUEST_RECEIVED',
 'Carol Patel has requested to join "Smart IoT Home Automation Platform".',
 FALSE, '2026-10-01 10:30:00'),

-- To Alice — her request outcomes
(5,  4, 'REQUEST_ACCEPTED',
 'Your request to join "AI-Powered Medical Diagnosis System" has been accepted. Welcome to the team!',
 TRUE,  '2026-08-12 14:30:00'),
(6,  4, 'REQUEST_PENDING',
 'Your request to join "Federated Learning for Privacy-Preserving ML" has been submitted and is under review.',
 TRUE,  '2026-10-03 08:00:00'),

-- To Bob — his request outcomes
(7,  5, 'REQUEST_ACCEPTED',
 'Your request to join "NLP-Based Sentiment Analysis for Social Media" has been accepted. Welcome!',
 TRUE,  '2026-08-17 10:00:00'),
(8,  5, 'REQUEST_REJECTED',
 'Your request to join "Blockchain for Academic Credential Verification" was not accepted at this time.',
 TRUE,  '2026-09-12 15:00:00'),

-- To Prof. Mehta (Faculty 2) — incoming requests
(9,  3, 'REQUEST_RECEIVED',
 'Bob Kumar has requested to join "NLP-Based Sentiment Analysis for Social Media".',
 TRUE,  '2026-08-15 11:00:00'),
(10, 3, 'REQUEST_RECEIVED',
 'Carol Patel has requested to join "Federated Learning for Privacy-Preserving ML".',
 FALSE, '2026-10-03 08:00:00'),

-- To David — outcomes
(11, 7, 'REQUEST_ACCEPTED',
 'Your request to join "Computer Vision for Smart Traffic Management" has been accepted.',
 TRUE,  '2026-04-22 16:00:00'),
(12, 7, 'REQUEST_PENDING',
 'Your request to join "AI-Powered Medical Diagnosis System" is under review.',
 FALSE, '2026-10-02 16:00:00'),

-- To Dr. Lisa Park — outcomes
(13, 8, 'REQUEST_ACCEPTED',
 'Your request to join "Federated Learning for Privacy-Preserving ML" has been accepted. Welcome!',
 TRUE,  '2026-09-03 09:00:00'),
(14, 8, 'REQUEST_REJECTED',
 'Your request to join "AI-Powered Medical Diagnosis System" was not accepted at this time.',
 TRUE,  '2026-08-08 11:00:00'),

-- New message notifications (unread)
(15, 4, 'NEW_MESSAGE',
 'Dr. Priya Sharma sent a message in "AI-Powered Medical Diagnosis System".',
 FALSE, '2026-09-30 09:00:00'),
(16, 5, 'NEW_MESSAGE',
 'Prof. Rahul Mehta sent a message in "NLP-Based Sentiment Analysis for Social Media".',
 FALSE, '2026-10-01 18:45:00'),

-- Milestone completed notifications
(17, 2, 'MILESTONE_COMPLETED',
 'Milestone "Dataset Collection & Preprocessing" in "AI-Powered Medical Diagnosis System" has been marked complete.',
 TRUE,  '2026-09-30 08:00:00'),
(18, 3, 'MILESTONE_COMPLETED',
 'Milestone "Data Collection & Annotation" in "NLP-Based Sentiment Analysis for Social Media" is complete.',
 TRUE,  '2026-09-15 18:00:00');


SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- END OF SEED DATA
-- ============================================================
