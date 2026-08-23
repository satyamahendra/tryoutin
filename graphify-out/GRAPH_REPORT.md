# Graph Report - tryoutin  (2026-08-23)

## Corpus Check
- 286 files · ~57,486 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1119 nodes · 3384 edges · 97 communities (64 shown, 33 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 76

## God Nodes (most connected - your core abstractions)
1. `cn()` - 212 edges
2. `authServer()` - 89 edges
3. `handleServerError()` - 88 edges
4. `Button()` - 58 edges
5. `useQueryParams()` - 49 edges
6. `requireAbility()` - 46 edges
7. `ServerResult` - 44 edges
8. `AnimDiv()` - 37 edges
9. `Badge()` - 30 edges
10. `useScreenSize()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `computeExamSessionsScores()`  [EXTRACTED]
  scripts/backfill-scores.ts → src/utils/helpers/compute-session-scores.ts
- `DeleteButton()` --indirect_call--> `deletePermission()`  [INFERRED]
  src/app/(protected)/(admin)/permissions/components/delete-button.tsx → src/app/(protected)/(admin)/permissions/services/delete-permission.ts
- `PermissionDetailModal()` --indirect_call--> `createUpdatePermission()`  [INFERRED]
  src/app/(protected)/(admin)/permissions/components/permission-detail-modal.tsx → src/app/(protected)/(admin)/permissions/services/create-update-permission.ts
- `ProductForm()` --indirect_call--> `createUpdateProduct()`  [INFERRED]
  src/app/(protected)/(admin)/products/components/product-detail-drawer.tsx → src/app/(protected)/(admin)/products/services/create-update-product.ts
- `Page()` --calls--> `hasPermissions()`  [EXTRACTED]
  src/app/(protected)/(admin)/products/page.tsx → src/utils/helpers/has-ability-server.ts

## Import Cycles
- None detected.

## Communities (97 total, 33 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (62): getProducts, MarkPopover(), MarkPopoverProps, categoryOptions, ExamGeneralForm(), ExamGeneralFormProps, ExamOptionForm(), ExamOptionFormProps (+54 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (49): features, Home(), metadata, steps, CategoryRow(), CategoryRowProps, ExamItem(), ExamItemProps (+41 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (29): sendMessage(), deleteExam(), examSelect, toggleArchiveExam(), getMyOrder, myOrderSelect, GetMySession, sessionSelect (+21 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (33): DeleteButtonProps, DeleteButtonProps, CreateExamButton(), ExamActions(), ExamActionsProps, buildExamValues(), collectErrors(), ExamForm() (+25 more)

### Community 4 - "Community 4"
Cohesion: 0.16
Nodes (23): OrderListProps, Props, ProductListProps, ReportListProps, Props, Props, Props, MyOrderListProps (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (37): babel-plugin-react-compiler, eslint, eslint-config-next, jsdom, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next (+29 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (26): geistMono, geistSans, inter, metadata, RootLayout(), DeleteButton(), PermissionItemProps, GetPermission (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (23): getOrder, orderSelect, createUpdatePermission(), deletePermission(), getPermission, permissionSelect, deleteProduct(), getProduct (+15 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (29): "account", "session", "user", "verification", "Permission", "Role", "RolePermission", "UserPermission" (+21 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (25): MessageForm(), MessageFormProps, ReportItemProps, GetReport, MessageFormSchema, messageSchema, ReportFormSchema, reportSchema (+17 more)

### Community 10 - "Community 10"
Cohesion: 0.10
Nodes (24): OrderList(), Page(), PageProps, PermissionsTable(), Page(), PageProps, ReportList(), Page() (+16 more)

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (13): Address, CoreApi, CoreApiConfig, CustomerDetails, ItemDetail, midtrans-client, MidtransError, Snap (+5 more)

### Community 12 - "Community 12"
Cohesion: 0.09
Nodes (20): {POST, GET}, Layout(), LayoutProps, GoogleItem(), Topbar(), Item(), ItemActions(), ItemContent() (+12 more)

### Community 13 - "Community 13"
Cohesion: 0.06
Nodes (31): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+23 more)

### Community 14 - "Community 14"
Cohesion: 0.10
Nodes (29): MySessionList(), PaginationParamsProps, AvatarBadge(), AvatarGroup(), AvatarGroupCount(), DrawerOverlay(), DrawerSwipeHandle(), EmptyContent() (+21 more)

### Community 15 - "Community 15"
Cohesion: 0.11
Nodes (21): GetOrder, getOrders, orderSelect, getPermissions, permissionSelect, GetProduct, productSelect, getReports (+13 more)

### Community 16 - "Community 16"
Cohesion: 0.21
Nodes (17): SidebarItem(), Sidebar(), Avatar(), AvatarFallback(), AvatarImage(), Drawer(), DrawerContent(), DrawerContext (+9 more)

### Community 17 - "Community 17"
Cohesion: 0.10
Nodes (20): ComboboxOption, DynamicProps, InfiniteCombobox(), InfiniteComboboxProps, StaticProps, FilterSidebar(), ComboboxChip(), ComboboxChips() (+12 more)

### Community 18 - "Community 18"
Cohesion: 0.30
Nodes (14): Checkbox(), DrawerClose(), DrawerFooter(), DrawerTrigger(), Field(), FieldDescription(), FieldError(), FieldGroup() (+6 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.13
Nodes (20): OrderDetailDrawer(), PermissionDetailModal(), PermissionItem(), ProductForm(), ReportDetailDrawer(), RoleDetailModal(), RoleItem(), UserDetailModal() (+12 more)

### Community 21 - "Community 21"
Cohesion: 0.23
Nodes (11): GET(), POST(), POST(), POST(), snap, Address, ItemDetail, TokenParameter (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.21
Nodes (11): OrderItem(), OrderItemProps, ProductItem(), ProductItemProps, ReportItem(), MyOrderItem(), MyOrderItemProps, MySessionCard() (+3 more)

### Community 23 - "Community 23"
Cohesion: 0.23
Nodes (11): main(), examListSelect, getLeaderboardExams, LeaderboardExam, getLeaderboard(), LeaderboardDetail, LeaderboardUser, RankInput (+3 more)

### Community 24 - "Community 24"
Cohesion: 0.20
Nodes (10): TryoutList(), formatNumber(), Page(), PageProps, getTryoutCategories, getTryoutHero, getTryoutTags, GetTryout (+2 more)

### Community 25 - "Community 25"
Cohesion: 0.19
Nodes (6): metadata, metadata, metadata, Footer(), LegalShell(), LegalShellProps

### Community 26 - "Community 26"
Cohesion: 0.23
Nodes (11): MyTryoutPerformance(), PerformanceSession, DesktopSidebar(), MobileDrawer(), NavigationSidebarProps, PartNav, QuestionNav, Accordion() (+3 more)

### Community 27 - "Community 27"
Cohesion: 0.15
Nodes (11): TryoutSessionPage(), getSession(), SessionFullData, sessionFullSelect, saveAnswer(), sessionPartSelect, StartedSession, startSession() (+3 more)

### Community 28 - "Community 28"
Cohesion: 0.28
Nodes (10): ReviewSessionPage(), NavigationSidebar(), SCORE_ANSWER_SELECT, SCORE_QUESTION_SELECT, PartScore, pct(), ScoreAnswer, scoreAnswers() (+2 more)

### Community 29 - "Community 29"
Cohesion: 0.21
Nodes (11): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 30 - "Community 30"
Cohesion: 0.24
Nodes (9): updateUser(), UserFormSchema, userSchema, ClassifiedError, classifyAxios(), classifyError(), classifyMidtrans(), classifyPrisma() (+1 more)

### Community 31 - "Community 31"
Cohesion: 0.20
Nodes (9): Option, Question, QuestionView(), QuestionViewProps, typeLabel, SubmitPartModal(), TimerDisplay(), TimerDisplayProps (+1 more)

### Community 32 - "Community 32"
Cohesion: 0.27
Nodes (9): SearchParamsProps, InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText() (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.18
Nodes (6): SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (9): axios, dependencies, axios, pg, @prisma/adapter-pg, react-dom, pg, @prisma/adapter-pg (+1 more)

### Community 35 - "Community 35"
Cohesion: 0.38
Nodes (5): LeaderboardGrid(), Page(), PageProps, getLeaderboardFilters(), LeaderboardFilters

### Community 36 - "Community 36"
Cohesion: 0.52
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 37 - "Community 37"
Cohesion: 0.40
Nodes (4): CreateProductButton(), ProductList(), Page(), PageProps

### Community 38 - "Community 38"
Cohesion: 0.47
Nodes (4): createUpdateProduct(), ProductFormSchema, productOptionSchema, productSchema

### Community 39 - "Community 39"
Cohesion: 0.47
Nodes (5): MyTryoutList(), Page(), PageProps, getMyTryoutCategories, getMyTryoutTags

### Community 40 - "Community 40"
Cohesion: 0.47
Nodes (4): Page(), GetTag, getTags, tagSelect

### Community 41 - "Community 41"
Cohesion: 0.50
Nodes (3): VALID_PREFIXES, PermissionFormSchema, permissionSchema

### Community 42 - "Community 42"
Cohesion: 0.60
Nodes (3): createUpdateRole(), RoleFormSchema, roleSchema

## Knowledge Gaps
- **275 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+270 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 14` to `Community 0`, `Community 1`, `Community 32`, `Community 3`, `Community 4`, `Community 36`, `Community 6`, `Community 33`, `Community 9`, `Community 12`, `Community 16`, `Community 17`, `Community 18`, `Community 20`, `Community 22`, `Community 26`, `Community 29`, `Community 31`?**
  _High betweenness centrality (0.198) - this node is a cross-community bridge._
- **Why does `authServer()` connect `Community 2` to `Community 1`, `Community 3`, `Community 35`, `Community 39`, `Community 40`, `Community 7`, `Community 10`, `Community 12`, `Community 15`, `Community 21`, `Community 23`, `Community 24`, `Community 25`, `Community 27`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 3` to `Community 0`, `Community 1`, `Community 6`, `Community 9`, `Community 12`, `Community 14`, `Community 16`, `Community 17`, `Community 18`, `Community 22`, `Community 24`, `Community 25`, `Community 26`, `Community 28`, `Community 31`, `Community 32`, `Community 33`, `Community 36`, `Community 37`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _275 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05194805194805195 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06542443064182195 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.10407239819004525 - nodes in this community are weakly interconnected._