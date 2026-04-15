-- Seed data for Trello Clone

-- Insert mock users
INSERT INTO users (id, username, email, full_name, avatar_url) VALUES
('11111111-1111-1111-1111-111111111111', 'john_doe', 'john@example.com', 'John Doe', 'https://i.pravatar.cc/150?img=1'),
('22222222-2222-2222-2222-222222222222', 'jane_smith', 'jane@example.com', 'Jane Smith', 'https://i.pravatar.cc/150?img=2'),
('33333333-3333-3333-3333-333333333333', 'bob_wilson', 'bob@example.com', 'Bob Wilson', 'https://i.pravatar.cc/150?img=3'),
('44444444-4444-4444-4444-444444444444', 'alice_brown', 'alice@example.com', 'Alice Brown', 'https://i.pravatar.cc/150?img=4');

-- Insert sample boards
INSERT INTO boards (id, title, description, background_color, created_by) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Product Roadmap', 'Q1 2024 Product Development', '#0079bf', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Marketing Campaign', 'Spring 2024 Marketing Initiatives', '#d29034', '22222222-2222-2222-2222-222222222222'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Personal Tasks', 'My daily todo list', '#519839', '11111111-1111-1111-1111-111111111111');

-- Insert board members
INSERT INTO board_members (board_id, user_id, role) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'admin'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'member'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'member'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'admin'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'member'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'admin');

-- Insert lists for Product Roadmap board
INSERT INTO lists (id, board_id, title, position) VALUES
('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Backlog', 0),
('10000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'In Progress', 1),
('10000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Review', 2),
('10000000-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Done', 3);

-- Insert lists for Marketing Campaign board
INSERT INTO lists (id, board_id, title, position) VALUES
('20000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Ideas', 0),
('20000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Planning', 1),
('20000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Executing', 2),
('20000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Completed', 3);

-- Insert lists for Personal Tasks board
INSERT INTO lists (id, board_id, title, position) VALUES
('30000000-0000-0000-0000-000000000001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'To Do', 0),
('30000000-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Doing', 1),
('30000000-0000-0000-0000-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Done', 2);

-- Insert cards for Product Roadmap
INSERT INTO cards (id, list_id, title, description, position, created_by) VALUES
('c0000001-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'User Authentication System', 'Implement OAuth2 and JWT authentication', 0, '11111111-1111-1111-1111-111111111111'),
('c0000002-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Dashboard Analytics', 'Create analytics dashboard with charts', 1, '11111111-1111-1111-1111-111111111111'),
('c0000003-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Mobile App Development', 'Build React Native mobile app', 2, '22222222-2222-2222-2222-222222222222'),
('c0000004-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'API Documentation', 'Write comprehensive API docs using Swagger', 0, '33333333-3333-3333-3333-333333333333'),
('c0000005-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 'Payment Integration', 'Integrate Stripe payment gateway', 1, '11111111-1111-1111-1111-111111111111'),
('c0000006-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', 'Code Review: Auth Module', 'Review authentication implementation', 0, '22222222-2222-2222-2222-222222222222'),
('c0000007-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000004', 'Setup CI/CD Pipeline', 'Configure GitHub Actions for deployment', 0, '33333333-3333-3333-3333-333333333333');

-- Insert cards for Marketing Campaign
INSERT INTO cards (id, list_id, title, description, position, due_date, created_by) VALUES
('c0000008-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000001', 'Social Media Strategy', 'Plan Q1 social media content calendar', 0, '2026-05-01', '22222222-2222-2222-2222-222222222222'),
('c0000009-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000002', 'Email Campaign Design', 'Design newsletter templates', 0, '2026-04-25', '44444444-4444-4444-4444-444444444444'),
('c0000010-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000003', 'Launch Product Video', 'Create and publish product demo video', 0, '2026-04-20', '22222222-2222-2222-2222-222222222222');

-- Insert labels
INSERT INTO labels (id, board_id, name, color) VALUES
('l0000001-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'High Priority', '#eb5a46'),
('l0000002-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Bug', '#c377e0'),
('l0000003-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Feature', '#61bd4f'),
('l0000004-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Design', '#ff9f1a'),
('l0000005-0000-0000-0000-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Content', '#00c2e0'),
('l0000006-0000-0000-0000-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Urgent', '#eb5a46');

-- Assign labels to cards
INSERT INTO card_labels (card_id, label_id) VALUES
('c0000001-0000-0000-0000-000000000001', 'l0000001-0000-0000-0000-000000000001'),
('c0000001-0000-0000-0000-000000000001', 'l0000003-0000-0000-0000-000000000003'),
('c0000005-0000-0000-0000-000000000005', 'l0000001-0000-0000-0000-000000000001'),
('c0000008-0000-0000-0000-000000000008', 'l0000005-0000-0000-0000-000000000005'),
('c0000009-0000-0000-0000-000000000009', 'l0000006-0000-0000-0000-000000000006');

-- Assign members to cards
INSERT INTO card_members (card_id, user_id) VALUES
('c0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111'),
('c0000001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333'),
('c0000004-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333'),
('c0000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111'),
('c0000008-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222222'),
('c0000009-0000-0000-0000-000000000009', '44444444-4444-4444-4444-444444444444');

-- Insert checklists
INSERT INTO checklists (id, card_id, title, position) VALUES
('cl000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'Implementation Tasks', 0),
('cl000002-0000-0000-0000-000000000002', 'c0000005-0000-0000-0000-000000000005', 'Integration Steps', 0);

-- Insert checklist items
INSERT INTO checklist_items (checklist_id, title, is_completed, position) VALUES
('cl000001-0000-0000-0000-000000000001', 'Setup OAuth providers', true, 0),
('cl000001-0000-0000-0000-000000000001', 'Implement JWT tokens', true, 1),
('cl000001-0000-0000-0000-000000000001', 'Add refresh token logic', false, 2),
('cl000001-0000-0000-0000-000000000001', 'Write unit tests', false, 3),
('cl000002-0000-0000-0000-000000000002', 'Create Stripe account', true, 0),
('cl000002-0000-0000-0000-000000000002', 'Setup webhook endpoints', false, 1),
('cl000002-0000-0000-0000-000000000002', 'Test payment flow', false, 2);

-- Insert comments
INSERT INTO comments (card_id, user_id, content) VALUES
('c0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Started working on the OAuth implementation. Google and GitHub providers are ready.'),
('c0000001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Great! I''ll handle the JWT token generation and validation.'),
('c0000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Stripe API keys have been added to the environment variables.');
