how to start:

1. clone repo

2. set env

3. seed data

-- Permissions
INSERT INTO permission (name) VALUES
('read home'),
('manage home'),
('read exams'),
('manage exams'),
('read tags'),
('manage tags'),
('read permissions'),
('manage permissions'),
('read roles'),
('manage roles'),
('read users'),
('manage users'),
('read orders'),
('manage orders'),
('read products'),
('manage products'),
('read reports'),
('manage reports')
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
('admin', 'read orders'),
('admin', 'manage orders'),
('admin', 'read products'),
('admin', 'manage products'),
('admin', 'read reports'),
('admin', 'manage reports'),
-- member: only the home dashboard
('member', 'read home'),
('member', 'manage home')
ON CONFLICT (role_name, permission_name) DO NOTHING;

access control (rbac)

every admin server action is guarded by requireAbility(permissions): the "admin"
role bypasses all checks, otherwise the caller must hold at least one of the
listed permissions. each admin page also redirects away if the visitor lacks
"read X" / "manage X".

page / resource      read action            mutate action
home                 read home              manage home
exams                read exams             manage exams
tags                 read tags              manage tags
orders               read orders            manage orders
permissions          read permissions       manage permissions
products             read products          manage products
reports              read reports           manage reports
roles                read roles             manage roles
users                read users             manage users

helper: src/utils/helpers/has-ability-server.ts -> requireAbility()

procedure pushing db edits

1. npx prisma generate
2. npx prisma migrate dev --name "<your-migration-name>"
3. npx prisma migrate deploy
