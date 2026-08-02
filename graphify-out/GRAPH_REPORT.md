# Graph Report - C:\Users\TUF\Documents\kerja\projects\SaaS\tryoutin  (2026-08-02)

## Corpus Check
- Corpus is ~46,338 words - fits in a single context window. You may not need a graph.

## Summary
- 993 nodes · 2912 edges · 78 communities (46 shown, 32 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Admin Order Management
- Permission Validation Schemas
- Permissions List Page
- Delete Permission Flow
- Order & Report Queries
- Midtrans Payment Client
- JS Build Dependencies
- Session Timer Components
- TypeScript Config
- Deploy & Infra Docs
- Marking & Reports
- List Data Queries
- Order Item & Product UI
- Product CRUD
- Combobox UI Component
- Shadcn Config
- Permission CRUD
- Exam & Tryout Cards
- Exam Import & Report
- Root App Shell
- API Route Handlers
- My Orders & Sessions
- Tryout Sidebars
- Tryout Session Flow
- Permission & Role Items
- Role CRUD
- Item List Components
- Root Layout
- Navigation Sidebar
- Pagination UI
- Sidebar Collapsibles
- Sheet UI Component
- Runtime Dependencies
- Tryout Categories Page
- Question View
- Tabs UI Component
- Globe Icon Asset
- Next.js Logo Asset
- User Update Form
- Review Data Query
- React Combobox Hook
- Vercel Logo Asset
- Window Icon Asset
- My Tryouts Query
- Tag Form Schema
- Axios HTTP Client
- Base UI React
- Better Auth Library
- CVA Utility
- Clsx Utility
- Dotenv
- ESLint Config
- Hookform Resolvers
- Lucide Icons
- Midtrans Client Lib
- Motion Library
- Next.js Framework
- Next Config
- Next Themes
- PG Driver
- Radix UI
- React Hook Form
- React Icons
- Shadcn Library
- Sonner Toasts
- Tailwind Merge
- TanStack Query
- Tailwind Animate
- UUID Utility
- Vaul Drawer
- Zod Validation
- PostCSS Config
- Global Window Types
- File Icon Asset

## God Nodes (most connected - your core abstractions)
1. `cn()` - 204 edges
2. `authServer()` - 108 edges
3. `handleServerError()` - 104 edges
4. `ServerResult` - 52 edges
5. `Button()` - 51 edges
6. `useQueryParams()` - 47 edges
7. `AnimDiv()` - 32 edges
8. `Badge()` - 24 edges
9. `useScreenSize()` - 24 edges
10. `EmptyMedia()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `RBAC Authorization Model` --semantically_similar_to--> `Legacy RBAC Seed Data`  [INFERRED] [semantically similar]
  README.md → readme.txt
- `app Service` --semantically_similar_to--> `svtyv-app Container`  [INFERRED] [semantically similar]
  compose.yaml → .github/workflows/deploy.yml
- `db Service` --semantically_similar_to--> `svtyv-db Container`  [INFERRED] [semantically similar]
  compose.yaml → .github/workflows/deploy.yml
- `useComboboxAnchor()` --references--> `react`  [EXTRACTED]
  src/components/ui/combobox.tsx → package.json
- `Drawer()` --references--> `react`  [EXTRACTED]
  src/components/ui/drawer.tsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **GitHub Actions Docker Deployment Pipeline** — _github_workflows_deploy_build_job, _github_workflows_deploy_ghcr, _github_workflows_deploy_svtyv_image, _github_workflows_deploy_deploy_job, _github_workflows_deploy_vps_ssh_deploy, _github_workflows_deploy_svtyv_net, _github_workflows_deploy_svtyv_db_container, _github_workflows_deploy_svtyv_app_container, _github_workflows_deploy_prisma_migrate_deploy [EXTRACTED 1.00]
- **Compose Container Topology** — compose_app_service, compose_db_service, compose_postgres_data_volume, _github_workflows_deploy_postgres17 [EXTRACTED 1.00]
- **RBAC Authorization Model** — readme_permission, readme_role, readme_role_permission, readme_rbac_model [EXTRACTED 1.00]

## Communities (78 total, 32 thin omitted)

### Community 0 - "Admin Order Management"
Cohesion: 0.07
Nodes (60): OrderDetailDrawer(), OrderList(), OrderListProps, Props, ProductList(), ProductListProps, getProducts, ProductFormSchema (+52 more)

### Community 1 - "Permission Validation Schemas"
Cohesion: 0.06
Nodes (54): VALID_PREFIXES, PermissionFormSchema, permissionSchema, RoleFormSchema, roleSchema, categoryOptions, ExamGeneralFormProps, ExamOptionForm() (+46 more)

### Community 2 - "Permissions List Page"
Cohesion: 0.08
Nodes (35): Page(), PageProps, PermissionsTable(), Page(), PageProps, Page(), PageProps, Page() (+27 more)

### Community 3 - "Delete Permission Flow"
Cohesion: 0.12
Nodes (32): DeleteButton(), DeleteButtonProps, deletePermission(), DeleteButton(), DeleteButtonProps, deleteRole(), CreateExamButton(), ExamActions() (+24 more)

### Community 4 - "Order & Report Queries"
Cohesion: 0.14
Nodes (13): getOrder, orderSelect, getReport, reportSelect, updateReport(), Response, selectUser, examSelect (+5 more)

### Community 5 - "Midtrans Payment Client"
Cohesion: 0.06
Nodes (14): MarkPopover(), Address, CoreApi, CoreApiConfig, CustomerDetails, ItemDetail, midtrans-client, MidtransError (+6 more)

### Community 6 - "JS Build Dependencies"
Cohesion: 0.06
Nodes (33): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, prisma (+25 more)

### Community 7 - "Session Timer Components"
Cohesion: 0.09
Nodes (31): MySessionList(), TimerDisplay(), TimerDisplayProps, AvatarBadge(), AvatarGroup(), AvatarGroupCount(), DrawerOverlay(), DrawerSwipeHandle() (+23 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.06
Nodes (31): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+23 more)

### Community 9 - "Deploy & Infra Docs"
Cohesion: 0.10
Nodes (25): Better Auth Authentication, Build & Deploy Workflow, Build Job, Deploy Job, GitHub Container Registry (GHCR), Midtrans Payment Integration, PostgreSQL 17, Prisma Migrate Deploy (+17 more)

### Community 10 - "Marking & Reports"
Cohesion: 0.11
Nodes (21): MarkPopoverProps, MessageForm(), MessageFormProps, GetReport, sendMessage(), MessageFormSchema, messageSchema, ReportFormSchema (+13 more)

### Community 11 - "List Data Queries"
Cohesion: 0.12
Nodes (17): getOrders, orderSelect, getPermissions, permissionSelect, productSelect, getReports, reportSelect, GetRoles (+9 more)

### Community 12 - "Order Item & Product UI"
Cohesion: 0.14
Nodes (18): OrderItem(), OrderItemProps, GetOrder, CreateProductButton(), ProductItem(), ProductItemProps, GetProduct, ReportDetailDrawer() (+10 more)

### Community 13 - "Product CRUD"
Cohesion: 0.12
Nodes (17): ProductForm(), createUpdateProduct(), deleteProduct(), getProduct, productSelect, UserDetailModal(), getPermissionsAndRoles(), getUser() (+9 more)

### Community 14 - "Combobox UI Component"
Cohesion: 0.11
Nodes (19): ComboboxOption, DynamicProps, InfiniteCombobox(), InfiniteComboboxProps, StaticProps, ComboboxChip(), ComboboxChips(), ComboboxChipsInput() (+11 more)

### Community 15 - "Shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 16 - "Permission CRUD"
Cohesion: 0.14
Nodes (14): PermissionDetailModal(), createUpdatePermission(), getPermission, permissionSelect, examSelect, getExams, getMySessions, sessionSelect (+6 more)

### Community 17 - "Exam & Tryout Cards"
Cohesion: 0.17
Nodes (15): ExamItemProps, GetExam, MyTryoutCardProps, GetMyTryout, TryoutCard(), TryoutCardProps, GetTryout, Card() (+7 more)

### Community 18 - "Exam Import & Report"
Cohesion: 0.18
Nodes (15): ImportExamButton(), ExamForm(), upsertExam(), ReportModal(), ReportModalProps, reportModalSchema, Dialog(), DialogContent() (+7 more)

### Community 19 - "Root App Shell"
Cohesion: 0.16
Nodes (7): {POST, GET}, Layout(), LayoutProps, Topbar(), auth, authClient, getSessionExtended()

### Community 20 - "API Route Handlers"
Cohesion: 0.25
Nodes (10): GET(), POST(), POST(), snap, Address, ItemDetail, TokenParameter, sha512() (+2 more)

### Community 21 - "My Orders & Sessions"
Cohesion: 0.19
Nodes (10): MyOrderItem(), MyOrderItemProps, GetMyOrder, MySessionCard(), MySessionCardProps, GetMySession, ReviewSessionPage(), Button() (+2 more)

### Community 22 - "Tryout Sidebars"
Cohesion: 0.18
Nodes (13): MyTryoutSidebar(), MyTryoutSidebarProps, TryoutSidebar(), TryoutSidebarProps, InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton() (+5 more)

### Community 23 - "Tryout Session Flow"
Cohesion: 0.18
Nodes (12): PageState, TryoutSessionPage(), getSession(), SessionFullData, sessionFullSelect, saveAnswer(), SaveAnswerInput, sessionPartSelect (+4 more)

### Community 24 - "Permission & Role Items"
Cohesion: 0.25
Nodes (11): PermissionItem(), PermissionItemProps, GetPermission, RoleItemProps, GetRole, Props, Badge(), badgeVariants (+3 more)

### Community 25 - "Role CRUD"
Cohesion: 0.18
Nodes (11): RoleDetailModal(), createUpdateRole(), getRole, roleSelect, ClassifiedError, classifyAxios(), classifyError(), classifyMidtrans() (+3 more)

### Community 26 - "Item List Components"
Cohesion: 0.19
Nodes (12): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+4 more)

### Community 27 - "Root Layout"
Cohesion: 0.19
Nodes (9): geistMono, geistSans, inter, metadata, RootLayout(), Providers(), QueryClientProviders(), ThemeProvider() (+1 more)

### Community 28 - "Navigation Sidebar"
Cohesion: 0.23
Nodes (9): DesktopSidebar(), MobileDrawer(), NavigationSidebarProps, PartNav, QuestionNav, Accordion(), AccordionContent(), AccordionItem() (+1 more)

### Community 29 - "Pagination UI"
Cohesion: 0.23
Nodes (10): PaginationParams(), PaginationParamsProps, Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps (+2 more)

### Community 30 - "Sidebar Collapsibles"
Cohesion: 0.29
Nodes (8): SidebarItem(), SidebarItemProps, Collapsible(), CollapsibleContent(), CollapsibleTrigger(), hasAccess(), MenuItem, menuItems

### Community 31 - "Sheet UI Component"
Cohesion: 0.18
Nodes (6): SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 32 - "Runtime Dependencies"
Cohesion: 0.22
Nodes (9): date-fns, dependencies, date-fns, @prisma/adapter-pg, @prisma/client, react-dom, @prisma/adapter-pg, @prisma/client (+1 more)

### Community 33 - "Tryout Categories Page"
Cohesion: 0.48
Nodes (4): Page(), PageProps, getTryoutCategories, getTryoutTags

### Community 34 - "Question View"
Cohesion: 0.33
Nodes (5): Option, Question, QuestionView(), QuestionViewProps, typeLabel

### Community 35 - "Tabs UI Component"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 36 - "Globe Icon Asset"
Cohesion: 0.50
Nodes (4): Site Branding / Link Indicator, Globe SVG Icon File, Globe Icon Graphic, Static UI Icon Asset

### Community 37 - "Next.js Logo Asset"
Cohesion: 0.50
Nodes (4): Next.js Logo SVG Asset, Next.js Framework, Next.js Logo, SVG Vector Format

### Community 39 - "Review Data Query"
Cohesion: 0.50
Nodes (3): getReviewData(), ReviewData, reviewSelect

### Community 40 - "React Combobox Hook"
Cohesion: 0.67
Nodes (3): react, react, useComboboxAnchor()

### Community 41 - "Vercel Logo Asset"
Cohesion: 0.67
Nodes (3): Brand Asset in public Folder, Vercel Logo SVG, Triangle Logomark

### Community 42 - "Window Icon Asset"
Cohesion: 1.00
Nodes (3): Flat UI Icon Design, Window Icon (SVG), Window App Icon

## Knowledge Gaps
- **258 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+253 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Session Timer Components` to `Admin Order Management`, `Permission Validation Schemas`, `Delete Permission Flow`, `Marking & Reports`, `Order Item & Product UI`, `Product CRUD`, `Combobox UI Component`, `Permission CRUD`, `Exam & Tryout Cards`, `Exam Import & Report`, `My Orders & Sessions`, `Tryout Sidebars`, `Permission & Role Items`, `Role CRUD`, `Item List Components`, `Root Layout`, `Navigation Sidebar`, `Pagination UI`, `Sidebar Collapsibles`, `Sheet UI Component`, `Question View`, `Tabs UI Component`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `JS Build Dependencies`, `React Combobox Hook`, `Axios HTTP Client`, `Base UI React`, `Better Auth Library`, `CVA Utility`, `Clsx Utility`, `Dotenv`, `Hookform Resolvers`, `Lucide Icons`, `Midtrans Client Lib`, `Motion Library`, `Next.js Framework`, `Next Themes`, `PG Driver`, `Radix UI`, `React Hook Form`, `React Icons`, `Shadcn Library`, `Sonner Toasts`, `Tailwind Merge`, `TanStack Query`, `Tailwind Animate`, `UUID Utility`, `Vaul Drawer`, `Zod Validation`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **Why does `react` connect `React Combobox Hook` to `Runtime Dependencies`, `Admin Order Management`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _258 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Order Management` be split into smaller, more focused modules?**
  _Cohesion score 0.06862026862026863 - nodes in this community are weakly interconnected._
- **Should `Permission Validation Schemas` be split into smaller, more focused modules?**
  _Cohesion score 0.06202435312024353 - nodes in this community are weakly interconnected._
- **Should `Permissions List Page` be split into smaller, more focused modules?**
  _Cohesion score 0.08299240210403273 - nodes in this community are weakly interconnected._