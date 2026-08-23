// ponytail: factories, not singletons — useFieldArray/append must get fresh objects
// each time, or shared references double-register on the first append (new-exam bug).
export const makeExamOption = () => ({
    id: null,
    option_text: "",
    option_image: null,
    score: 0,
    is_correct: null,
    order_index: null,
})

export const makeExamQuestion = () => ({
    id: null,
    type: null,
    question_text: "",
    question_image: null,
    explanation: null,
    explanation_image: null,
    order_index: null,
    options: [makeExamOption()],
})

export const makeExamPart = () => ({
    id: null,
    name: "",
    order_index: null,
    passing_score: 0,
    duration_minutes: 0,
    questions: [makeExamQuestion()],
})

export const makeExam = () => ({
    id: null,
    title: "",
    description: null,
    category: "",
    product_id: null,
    tags: [],
    parts: [makeExamPart()],
})
