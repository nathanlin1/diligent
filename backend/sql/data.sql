INSERT INTO users (id, data)
VALUES (
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  jsonb_build_object(
    'email', 'molly@books.com',
    'name', 'Molly Member',
    'password_hash', crypt('mollymember', gen_salt('bf'))
  )
);

INSERT INTO users (id, data)
VALUES (
  'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  jsonb_build_object(
    'email', 'anna@books.com',
    'name', 'Anna Admin',
    'password_hash', crypt('annaadmin', gen_salt('bf'))
  )
);

INSERT INTO workspaces (id, owner_id, data)
VALUES
  ('550e8400-e29b-41d4-a716-446655440002', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', jsonb_build_object('name', 'WS 1', 'description', 'Workspace 1')),
  ('550e8400-e29b-41d4-a716-446655440003', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', jsonb_build_object('name', 'WS 2', 'description', 'Workspace 2')),
  ('550e8400-e29b-41d4-a716-446655440004', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', jsonb_build_object('name', 'WS 3', 'description', 'Workspace 3')),
  ('550e8400-e29b-41d4-a716-446655440005', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', jsonb_build_object('name', 'WS 4', 'description', 'Workspace 4')),
  ('550e8400-e29b-41d4-a716-446655440006', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', jsonb_build_object('name', 'WS 5', 'description', 'Workspace 5')),
  ('550e8400-e29b-41d4-a716-446655440007', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', jsonb_build_object('name', 'WS 6', 'description', 'Workspace 6'));

INSERT INTO user_workspaces (user_id, workspace_id)
VALUES
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '550e8400-e29b-41d4-a716-446655440002'),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '550e8400-e29b-41d4-a716-446655440004'),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '550e8400-e29b-41d4-a716-446655440006'),
  ('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', '550e8400-e29b-41d4-a716-446655440002'),
  ('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', '550e8400-e29b-41d4-a716-446655440003'),
  ('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', '550e8400-e29b-41d4-a716-446655440004'),
  ('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', '550e8400-e29b-41d4-a716-446655440007');

INSERT INTO channels (id, workspace_id, data)
VALUES
  (
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440002',
    jsonb_build_object('name', 'WS 1 Channel', 'description', 'Channel for WS 1')
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440002',
    jsonb_build_object('name', 'Assignment 1', 'description', 'Channel for Assignment 1 discussions')
  ),
  (
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440002',
    jsonb_build_object('name', 'General', 'description', 'General discussion channel')
  ),
  (
    '550e8400-e29b-41d4-a716-446655440007',
    '550e8400-e29b-41d4-a716-446655440002',
    jsonb_build_object('name', 'Assignment 2', 'description', 'Channel for Assignment 2 discussions')
  ),
  (
    '550e8400-e29b-41d4-a716-446655440008',
    '550e8400-e29b-41d4-a716-446655440003',
    jsonb_build_object('name', 'Assignment 1', 'description', 'Channel for Assignment 1 discussions')
  ),
  (
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-446655440003',
    jsonb_build_object('name', 'Assignment 2', 'description', 'Channel for Assignment 2 discussions')
  );

INSERT INTO messages (id, channel_id, user_id, data)
VALUES
  (
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440004', 
    'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 
    jsonb_build_object('content', '1', 'timestamp', '2024-01-01T12:00:00Z', 'owner_name', 'Anna Admin')
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440004',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 
    jsonb_build_object('content', '2', 'timestamp', '2024-01-01T12:05:00Z', 'owner_name', 'Molly Member')
  ),
  (
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440005', 
    'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 
    jsonb_build_object('content', 'asgn1', 'timestamp', '2024-01-01T12:10:00Z', 'owner_name', 'Anna Admin')
  ),
  (
    '660e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440006', 
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 
    jsonb_build_object('content', 'WS 1', 'timestamp', '2024-01-01T12:15:00Z', 'owner_name', 'Molly Member')
  ),
    (
    '660e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440006', 
    'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 
    jsonb_build_object('content', 'General chat', 'timestamp', '2024-01-01T12:15:00Z', 'owner_name', 'Anna Admin')
  ),
  (
    '660e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440007',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 
    jsonb_build_object('content', 'Any questions about Assignment 1?', 'timestamp', '2024-01-01T12:20:00Z', 'owner_name', 'Molly Member')
  );