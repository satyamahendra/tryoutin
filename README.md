how to start:

1. clone repo

2. set env

3. seed data

-- Permissions
INSERT INTO permission (name) VALUES
('read home'),
('manage home'),
('read permissions'),
('manage permissions'),
('read roles'),
('manage roles'),
('read users'),
('manage users')
ON CONFLICT (name) DO NOTHING;

-- Roles
INSERT INTO role (name) VALUES
('admin'),
('member')
ON CONFLICT (name) DO NOTHING;

-- RolePermissions
INSERT INTO role_permission (role_name, permission_name) VALUES
('admin', 'read home'),
('admin', 'manage home'),
('admin', 'read permissions'),
('admin', 'manage permissions'),
('admin', 'read roles'),
('admin', 'manage roles'),
('admin', 'read users'),
('admin', 'manage users'),
('member', 'read home'),
('member', 'manage home')
ON CONFLICT (role_name, permission_name) DO NOTHING;
