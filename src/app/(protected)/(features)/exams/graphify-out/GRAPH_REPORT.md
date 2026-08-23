# Graph Report - exams  (2026-08-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 95 nodes · 165 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b066588f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

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

## God Nodes (most connected - your core abstractions)
1. `ExamSchema` - 8 edges
2. `arrayErrorMessage()` - 7 edges
3. `GetExam` - 5 edges
4. `upsertExam()` - 5 edges
5. `ExamForm()` - 5 edges
6. `ExamActions()` - 4 edges
7. `GetExams` - 3 edges
8. `QuestionTypePath` - 3 edges
9. `ExamGeneralForm()` - 3 edges
10. `ExamPartForm()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `CreateExamButton()` --indirect_call--> `createExam()`  [INFERRED]
  components/create-exam-button.tsx → services/create-exam.ts
- `ImportExamButton()` --indirect_call--> `upsertExam()`  [INFERRED]
  components/import-exam-button.tsx → [id]/services/upsert-exam.ts
- `ExamList()` --calls--> `GetExams`  [EXTRACTED]
  components/exam-list.tsx → services/get-exams.ts
- `ExamForm()` --indirect_call--> `upsertExam()`  [INFERRED]
  [id]/components/exam-form.tsx → [id]/services/upsert-exam.ts
- `Page()` --calls--> `GetExam`  [EXTRACTED]
  [id]/page.tsx → [id]/services/get-exam.ts

## Import Cycles
- None detected.

## Communities (10 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (17): categoryOptions, ExamGeneralForm(), ExamGeneralFormProps, ExamPartForm(), ExamPartFormProps, ExamQuestionForm(), TagPicker(), TagPickerProps (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.23
Nodes (9): CategoryRow(), CategoryRowProps, ExamItem(), ExamItemProps, ExamList(), ExamListProps, examSelect, GetExam (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.27
Nodes (6): CreateExamButton(), ImportExamButton(), upsertExam(), ExamSchema, PageProps, createExam()

### Community 3 - "Community 3"
Cohesion: 0.27
Nodes (7): ExamForm(), ExamFormTypes, ExamFormScrollProps, Page(), PageProps, examSelect, GetExam

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (8): ExamQuestionFormProps, questionTypes, typeBadgeColors, QuestionExplanationImagePath, QuestionExplanationPath, QuestionImagePath, QuestionOptionsArrayPath, QuestionTextPath

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (7): imageField, OptionOrderIndexPath, optionSchema, PartOrderIndexPath, partSchema, QuestionOrderIndexPath, questionSchema

### Community 6 - "Community 6"
Cohesion: 0.25
Nodes (7): ExamOptionForm(), ExamOptionFormProps, OptionImagePath, OptionIsCorrectPath, OptionScorePath, OptionTextPath, QuestionTypePath

### Community 7 - "Community 7"
Cohesion: 0.48
Nodes (4): ExamActions(), ExamActionsProps, deleteExam(), toggleArchiveExam()

## Knowledge Gaps
- **27 isolated node(s):** `ExamGeneralFormProps`, `ExamPartFormProps`, `TagPickerProps`, `CategoryRowProps`, `ExamItemProps` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ExamSchema` connect `Community 2` to `Community 0`, `Community 3`, `Community 4`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `upsertExam()` connect `Community 2` to `Community 3`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `upsertExam()` (e.g. with `ImportExamButton()` and `ExamForm()`) actually correct?**
  _`upsertExam()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ExamGeneralFormProps`, `ExamPartFormProps`, `TagPickerProps` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._