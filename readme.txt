-- ─────────────────────────────────────────────
--  Seed: permissions, roles, and role → permission grants
--  Covers the WHOLE app (every resource gated by RBAC).
--  Safe to re-run: all statements use ON CONFLICT DO NOTHING.
-- ─────────────────────────────────────────────

-- 1. Permissions (one row per "read X" / "manage X")
INSERT INTO permission (name) VALUES
  ('read home'),         ('manage home'),
  ('read exams'),        ('manage exams'),
  ('read tags'),         ('manage tags'),
  ('read permissions'),  ('manage permissions'),
  ('read roles'),        ('manage roles'),
  ('read users'),        ('manage users'),
  ('read orders'),       ('manage orders'),
  ('read products'),     ('manage products'),
  ('read reports'),      ('manage reports')
ON CONFLICT (name) DO NOTHING;

-- 2. Roles
INSERT INTO role (name) VALUES
  ('admin'),
  ('member')
ON CONFLICT (name) DO NOTHING;

-- 3. Role → Permission grants
INSERT INTO role_permission (role_name, permission_name) VALUES
  -- admin: full access to everything
  ('admin', 'read home'),         ('admin', 'manage home'),
  ('admin', 'read exams'),        ('admin', 'manage exams'),
  ('admin', 'read tags'),         ('admin', 'manage tags'),
  ('admin', 'read permissions'),  ('admin', 'manage permissions'),
  ('admin', 'read roles'),        ('admin', 'manage roles'),
  ('admin', 'read users'),        ('admin', 'manage users'),
  ('admin', 'read orders'),       ('admin', 'manage orders'),
  ('admin', 'read products'),     ('admin', 'manage products'),
  ('admin', 'read reports'),      ('admin', 'manage reports'),
  -- member: only the home dashboard
  ('member', 'read home'),        ('member', 'manage home')
ON CONFLICT (role_name, permission_name) DO NOTHING;
