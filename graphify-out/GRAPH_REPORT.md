# Graph Report - src\app\(protected)  (2026-08-15)

## Corpus Check
- 141 files · ~31,958 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 441 nodes · 654 edges · 27 communities (22 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.78)
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

## God Nodes (most connected - your core abstractions)
1. `ExamSchema` - 9 edges
2. `getProducts` - 7 edges
3. `arrayErrorMessage()` - 7 edges
4. `dayKey()` - 6 edges
5. `ProductForm()` - 5 edges
6. `getExam` - 5 edges
7. `upsertExam()` - 5 edges
8. `getMySessions` - 5 edges
9. `getTags` - 5 edges
10. `TryoutSessionPage()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `ExamGeneralForm()` --calls--> `getProducts`  [EXTRACTED]
  (features)/exams/[id]/components/exam-general-form.tsx → (admin)/products/services/get-products.ts
- `TagPicker()` --indirect_call--> `getTags`  [INFERRED]
  (features)/exams/[id]/components/tag-picker.tsx → (features)/tags/services/get-tags.ts
- `ImportExamButton()` --indirect_call--> `upsertExam()`  [INFERRED]
  (features)/exams/components/import-exam-button.tsx → (features)/exams/[id]/services/upsert-exam.ts
- `MySessionList()` --indirect_call--> `getMySessions`  [INFERRED]
  (features)/my-sessions/components/my-session-list.tsx → (features)/my-sessions/services/get-my-sessions.ts
- `Page()` --calls--> `getMySessions`  [EXTRACTED]
  home/page.tsx → (features)/my-sessions/services/get-my-sessions.ts

## Import Cycles
- None detected.

## Communities (27 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (45): ImportExamButton(), ExamForm(), ExamFormTypes, ExamFormScrollProps, categoryOptions, ExamGeneralFormProps, ExamOptionFormProps, ExamPartForm() (+37 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (25): ReviewSessionPage(), getReviewData(), ReviewData, reviewSelect, NavigationSidebarProps, PartNav, QuestionNav, Option (+17 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (20): MarkPopover(), MarkPopoverProps, MessageForm(), MessageFormProps, ReportDetailDrawer(), ReportItemProps, ReportList(), ReportListProps (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (18): CreateProductButton(), ProductForm(), ProductItem(), ProductItemProps, ProductList(), ProductListProps, PageProps, createUpdateProduct() (+10 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (15): MySessionCardProps, FILTERS, FilterType, MySessionList(), GetMySession, getMySessions, sessionSelect, calcStreak() (+7 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (14): MyTryoutCardProps, MyTryoutDetailModal(), MyTryoutList(), MyTryoutListProps, PerformanceSession, Page(), PageProps, getMyTryoutCategories (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (15): TryoutCardProps, TryoutDetailModal(), TryoutList(), TryoutListProps, formatNumber(), Page(), PageProps, getTryoutCategories (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (11): CategoryRow(), CategoryRowProps, CreateExamButton(), ExamItemProps, ExamList(), ExamListProps, PageProps, createExam() (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (10): OrderDetailDrawer(), OrderItemProps, OrderList(), OrderListProps, PageProps, getOrder, orderSelect, GetOrder (+2 more)

### Community 9 - "Community 9"
Cohesion: 0.16
Nodes (10): DeleteButton(), DeleteButtonProps, PermissionItemProps, PermissionsTable(), Props, PageProps, deletePermission(), GetPermission (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (10): DeleteButton(), DeleteButtonProps, RoleItemProps, Props, RolesTable(), PageProps, deleteRole(), GetRole (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.19
Nodes (11): TagPicker(), TagPickerProps, TagList(), TagListProps, Page(), createTag(), deleteTag(), GetTag (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (10): MyOrderDetailDrawer(), MyOrderItemProps, MyOrderList(), MyOrderListProps, PageProps, getMyOrder, myOrderSelect, GetMyOrder (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (7): PerformanceList(), PerformanceListProps, scoreConfig, TYPE_OPTIONS, PageProps, getMyPerformance, TryoutPerformance

### Community 14 - "Community 14"
Cohesion: 0.20
Nodes (8): Props, Props, UsersTable(), PageProps, getUsers(), User, userSelect, UsersPage

### Community 15 - "Community 15"
Cohesion: 0.28
Nodes (8): UserDetailModal(), getPermissionsAndRoles(), getUser(), Response, selectUser, updateUser(), UserFormSchema, userSchema

### Community 16 - "Community 16"
Cohesion: 0.32
Nodes (7): PermissionDetailModal(), createUpdatePermission(), getPermission, permissionSelect, VALID_PREFIXES, PermissionFormSchema, permissionSchema

### Community 17 - "Community 17"
Cohesion: 0.40
Nodes (6): RoleDetailModal(), createUpdateRole(), getRole, roleSelect, RoleFormSchema, roleSchema

### Community 18 - "Community 18"
Cohesion: 0.48
Nodes (4): ExamActions(), ExamActionsProps, deleteExam(), toggleArchiveExam()

## Knowledge Gaps
- **117 isolated node(s):** `OrderItemProps`, `OrderListProps`, `PageProps`, `orderSelect`, `orderSelect` (+112 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getProducts` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `arrayErrorMessage()` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `OrderItemProps`, `OrderListProps`, `PageProps` to the rest of the system?**
  _117 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.061581920903954805 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06039488966318235 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.10416666666666667 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.11822660098522167 - nodes in this community are weakly interconnected._